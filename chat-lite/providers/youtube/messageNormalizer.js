import { safeHtml, htmlToText } from '../../shared/utils/html.js';

function toPlainTextFactory(customFn) {
  if (typeof customFn === 'function') {
    return (value) => customFn(value ?? '');
  }
  return (value) => htmlToText(value ?? '');
}

export function resolveYouTubeEvent(snippet) {
  if (!snippet) {
    return null;
  }
  const rawType = typeof snippet.type === 'string' ? snippet.type.trim() : '';
  const normalized = rawType.toLowerCase();

  if (!normalized || normalized === 'textmessageevent') {
    return null;
  }

  if (
    normalized === 'superchatevent' ||
    normalized === 'superstickerevent' ||
    normalized === 'fanfundingevent'
  ) {
    return null;
  }

  if (normalized === 'newsponsorevent') {
    return 'membership';
  }

  if (normalized === 'membermilestonechatevent') {
    return 'membership_milestone';
  }

  if (normalized === 'membershipgiftingevent' || snippet?.membershipGiftingDetails) {
    return 'membership_gift';
  }

  if (normalized === 'giftmembershipreceivedevent' || snippet?.giftMembershipReceivedDetails) {
    return 'membership_gift_received';
  }

  return normalized;
}

export function buildYouTubeChatBadges(author, options = {}) {
  const includeMemberBadge = Boolean(options?.includeMemberBadge);
  const badges = [];

  if (author?.isChatOwner) {
    badges.push({ type: 'text', text: '👑' });
  }
  if (author?.isChatModerator) {
    badges.push({ type: 'text', text: '🛡️' });
  }
  if (author?.isChatSponsor || includeMemberBadge) {
    badges.push({ type: 'text', text: '⭐' });
  }

  return badges;
}

export function deriveYouTubeMembership(snippet, sanitizedMessage, options = {}) {
  if (!snippet) {
    return null;
  }

  const toPlainText = toPlainTextFactory(options.toPlainText);
  const type = typeof snippet.type === 'string' ? snippet.type.trim().toLowerCase() : '';
  const toText = (value) => toPlainText(value || '').trim();

  const fallbackPreview = () => {
    const fromSnippet = toText(snippet.displayMessage || '');
    if (fromSnippet) {
      return fromSnippet;
    }
    if (sanitizedMessage) {
      const fromSanitized = toText(sanitizedMessage);
      if (fromSanitized) {
        return fromSanitized;
      }
    }
    return '';
  };

  let result = null;

  if (type === 'newsponsorevent') {
    const details = snippet.newSponsorDetails || {};
    const level = toText(details.memberLevelName);
    const isUpgrade = Boolean(details.isUpgrade);
    const membershipLabel = isUpgrade ? 'Membership Upgrade' : 'New Member';
    const subtitle = level || (isUpgrade ? 'Upgraded channel membership' : 'Joined channel membership');

    result = {
      membership: membershipLabel,
      subtitle,
      event: isUpgrade ? 'membership_upgrade' : 'membership',
      note: level ? `${membershipLabel}: ${level}` : membershipLabel,
      includeMemberBadge: true
    };

    if (level) {
      result.membershipLevel = level;
    }
  } else if (type === 'membermilestonechatevent') {
    const details = snippet.memberMilestoneChatDetails || {};
    const level = toText(details.memberLevelName);
    const monthsRaw = Number(details.memberMonth);
    const hasMonths = Number.isFinite(monthsRaw) && monthsRaw > 0;
    const monthLabel = hasMonths ? `${monthsRaw} month${monthsRaw === 1 ? '' : 's'}` : '';
    const subtitleParts = [];
    if (monthLabel) {
      subtitleParts.push(monthLabel);
    }
    if (level) {
      subtitleParts.push(level);
    }

    result = {
      membership: 'Membership Milestone',
      subtitle: subtitleParts.join(' · ') || null,
      event: 'membership_milestone',
      note: subtitleParts.join(' · ') || 'Membership Milestone',
      includeMemberBadge: true
    };

    if (hasMonths) {
      result.membershipMonths = monthsRaw;
    }
    if (level) {
      result.membershipLevel = level;
    }
  } else if (type === 'membershipgiftingevent' || snippet.membershipGiftingDetails) {
    const details = snippet.membershipGiftingDetails || {};
    const level = toText(details.giftMembershipsLevelName);
    const countRaw = Number(details.giftMembershipsCount);
    const count = Number.isFinite(countRaw) && countRaw > 0 ? countRaw : 1;
    const membershipLabel = count === 1 ? 'Gifted a Membership' : `Gifted ${count} Memberships`;

    result = {
      membership: membershipLabel,
      subtitle: level || null,
      event: 'membership_gift',
      note: level ? `${membershipLabel}: ${level}` : membershipLabel,
      includeMemberBadge: true
    };

    if (level) {
      result.membershipLevel = level;
    }
    result.membershipGiftCount = count;

    const gifter = toText(details.giftMembershipsGifterChannelName || '') || toText(details.giftMembershipsGifterDisplayName || '');
    if (gifter) {
      result.membershipGifter = gifter;
    }
  } else if (type === 'giftmembershipreceivedevent' || snippet.giftMembershipReceivedDetails) {
    const details = snippet.giftMembershipReceivedDetails || {};
    const level = toText(details.memberLevelName);
    const gifter = toText(details.gifterDisplayName || '');

    result = {
      membership: 'Gift Membership Received',
      subtitle: level || null,
      event: 'membership_gift_received',
      note: level ? `Gift Membership Received: ${level}` : 'Gift Membership Received',
      includeMemberBadge: true
    };

    if (level) {
      result.membershipLevel = level;
    }
    if (gifter) {
      result.membershipGifter = gifter;
    }
  } else if (type === 'membershipslevelsupdatedevent' || snippet.membershipsLevelsUpdatedDetails) {
    const details = snippet.membershipsLevelsUpdatedDetails || {};
    const fromLevel = toText(details.previousMembershipLevelName || '');
    const toLevel = toText(details.membershipLevelName || '');

    result = {
      membership: 'Membership Levels Updated',
      subtitle: toLevel || null,
      event: 'membership_levels_updated',
      note: toLevel ? `Membership Level: ${toLevel}` : 'Membership Levels Updated',
      includeMemberBadge: true
    };

    result.membership = 'Membership Upgrade';
    if (fromLevel || toLevel) {
      const upgradeMessage = fromLevel ? `Upgraded from ${fromLevel}` : 'Upgraded membership level';
      const toLabel = toLevel ? 'to' : '';
      result.subtitle = toLevel ? `${upgradeMessage} ${toLabel} ${toLevel}` : upgradeMessage;
      result.note = toLevel ? `${upgradeMessage} ${toLabel} ${toLevel}` : upgradeMessage;
    }
    if (toLevel) {
      result.membershipLevel = toLevel;
    }
  } else if (type === 'membershipsannouncementevent' || snippet.membershipsAnnouncementDetails) {
    const details = snippet.membershipsAnnouncementDetails || {};
    const level = toText(details.memberLevelName);
    const announcement = toText(details.message || '');

    result = {
      membership: 'Membership Announcement',
      subtitle: level || null,
      event: 'membership_announcement',
      note: level ? `Membership Announcement: ${level}` : 'Membership Announcement',
      includeMemberBadge: true
    };

    if (level) {
      result.membershipLevel = level;
    }
    if (announcement) {
      result.chatmessage = safeHtml(announcement);
    }
  } else if (type === 'membershipsgiftredeemedevent' || snippet.membershipsGiftRedeemedDetails) {
    const details = snippet.membershipsGiftRedeemedDetails || {};
    const level = toText(details.memberLevelName);
    const gifter = toText(details.gifterDisplayName || '');

    result = {
      membership: 'Gift Membership Redeemed',
      subtitle: level || null,
      event: 'membership_gift_redeemed',
      note: level ? `Gift Membership Redeemed: ${level}` : 'Gift Membership Redeemed',
      includeMemberBadge: true
    };

    if (level) {
      result.membershipLevel = level;
    }
    if (gifter) {
      result.membershipGifter = gifter;
    }
  } else if (type === 'paidmembershipslevelupgradedevent' || snippet.paidMembersAnnouncementDetails) {
    const details = snippet.paidMembersAnnouncementDetails || {};
    const level = toText(details.memberLevelName);

    result = {
      membership: 'Membership Upgrade',
      subtitle: level || null,
      event: 'membership_upgrade',
      note: level ? `Membership Upgrade: ${level}` : 'Membership Upgrade',
      includeMemberBadge: true
    };

    if (level) {
      result.membershipLevel = level;
    }
  } else if (type === 'paidmembershipsrewardredeemedevent' || snippet.paidMembersRewardRedemptionDetails) {
    const details = snippet.paidMembersRewardRedemptionDetails || {};
    const reward = toText(details.rewardName || '');

    result = {
      membership: 'Membership Reward',
      subtitle: reward || null,
      event: 'membership_reward_redeemed',
      note: reward ? `Membership Reward Redeemed: ${reward}` : 'Membership Reward Redeemed',
      includeMemberBadge: true
    };
  }

  if (!result) {
    return null;
  }

  if (!result.previewText) {
    const preview = fallbackPreview();
    result.previewText = preview || result.membership || '';
  }

  return result;
}

export function buildYouTubeMembershipMeta(snippet, membershipInfo = {}, options = {}) {
  const meta = {};
  const info = membershipInfo || {};
  const toPlainText = toPlainTextFactory(options.toPlainText);

  if (info.membershipLevel) {
    meta.levelName = info.membershipLevel;
  }
  if (Number.isFinite(info.membershipMonths)) {
    meta.totalMonths = info.membershipMonths;
  }
  if (Number.isFinite(info.membershipGiftCount)) {
    meta.giftCount = info.membershipGiftCount;
  }
  if (info.membershipGifter) {
    meta.giftedBy = info.membershipGifter;
  }
  if (info.event) {
    meta.eventType = info.event;
  }
  if (info.previewText) {
    meta.previewText = info.previewText;
  }
  if (info.chatmessage) {
    const highlightText = toPlainText(info.chatmessage);
    if (highlightText) {
      meta.highlightText = highlightText;
    }
  }

  const snippetType = typeof snippet?.type === 'string' ? snippet.type.trim() : '';
  if (snippetType) {
    meta.snippetType = snippetType;
  }

  const membershipDetails = snippet?.membershipDetails;
  if (membershipDetails) {
    if (membershipDetails.highestAccessibleLevel) {
      meta.highestLevelId = membershipDetails.highestAccessibleLevel;
    }
    if (membershipDetails.highestAccessibleLevelDisplayName) {
      meta.highestLevelName = membershipDetails.highestAccessibleLevelDisplayName;
    }
    if (Array.isArray(membershipDetails.accessibleLevels) && membershipDetails.accessibleLevels.length) {
      meta.accessibleLevels = membershipDetails.accessibleLevels.slice();
    }

    const duration = membershipDetails.membershipsDuration || null;
    if (duration && (duration.memberSince || duration.memberTotalDurationMonths !== undefined)) {
      const normalizedDuration = {};
      if (duration.memberSince) {
        normalizedDuration.memberSince = duration.memberSince;
      }
      const totalMonths = Number(duration.memberTotalDurationMonths);
      if (Number.isFinite(totalMonths)) {
        normalizedDuration.totalMonths = totalMonths;
      }
      if (Object.keys(normalizedDuration).length) {
        meta.duration = normalizedDuration;
      }
    }

    const durationAtLevel = membershipDetails.membershipsDurationAtLevel;
    if (Array.isArray(durationAtLevel) && durationAtLevel.length) {
      const normalizedLevels = durationAtLevel
        .map((entry) => {
          if (!entry) {
            return null;
          }
          const normalizedEntry = {};
          if (entry.level) {
            normalizedEntry.levelId = entry.level;
          }
          if (entry.memberSince) {
            normalizedEntry.memberSince = entry.memberSince;
          }
          const totalMonths = Number(entry.memberTotalDurationMonths);
          if (Number.isFinite(totalMonths)) {
            normalizedEntry.totalMonths = totalMonths;
          }
          return Object.keys(normalizedEntry).length ? normalizedEntry : null;
        })
        .filter(Boolean);
      if (normalizedLevels.length) {
        meta.durationByLevel = normalizedLevels;
      }
    }
  }

  const milestoneDetails = snippet?.memberMilestoneChatDetails;
  if (milestoneDetails) {
    const milestoneMeta = {};
    const levelName = toPlainText(milestoneDetails.memberLevelName || '');
    if (levelName) {
      milestoneMeta.levelName = levelName;
    }
    const milestoneMonths = Number(milestoneDetails.memberMonth);
    if (Number.isFinite(milestoneMonths)) {
      milestoneMeta.months = milestoneMonths;
    }
    const userComment = toPlainText(milestoneDetails.userComment || '');
    if (userComment) {
      milestoneMeta.userComment = userComment;
    }
    if (Object.keys(milestoneMeta).length) {
      meta.milestone = milestoneMeta;
    }
  }

  const newSponsorDetails = snippet?.newSponsorDetails;
  if (newSponsorDetails) {
    const sponsorMeta = {};
    const levelName = toPlainText(newSponsorDetails.memberLevelName || '');
    if (levelName) {
      sponsorMeta.levelName = levelName;
    }
    if (Object.prototype.hasOwnProperty.call(newSponsorDetails, 'isUpgrade')) {
      sponsorMeta.isUpgrade = Boolean(newSponsorDetails.isUpgrade);
    }
    if (Object.keys(sponsorMeta).length) {
      meta.newSponsor = sponsorMeta;
    }
  }

  const giftingDetails = snippet?.membershipGiftingDetails;
  if (giftingDetails) {
    const giftingMeta = {};
    const levelName = toPlainText(giftingDetails.giftMembershipsLevelName || '');
    if (levelName) {
      giftingMeta.levelName = levelName;
    }
    const giftCount = Number(giftingDetails.giftMembershipsCount);
    if (Number.isFinite(giftCount)) {
      giftingMeta.count = giftCount;
    }
    if (Object.keys(giftingMeta).length) {
      meta.gifting = giftingMeta;
    }
  }

  const receivedDetails = snippet?.giftMembershipReceivedDetails;
  if (receivedDetails) {
    const receivedMeta = {};
    const levelName = toPlainText(receivedDetails.memberLevelName || '');
    if (levelName) {
      receivedMeta.levelName = levelName;
    }
    const gifter = toPlainText(receivedDetails.gifterDisplayName || '');
    if (gifter) {
      receivedMeta.gifter = gifter;
    }
    if (Object.keys(receivedMeta).length) {
      meta.receivedGift = receivedMeta;
    }
  }

  return Object.keys(meta).length ? meta : null;
}

export function normalizeYouTubeLiveChatItem(item, options = {}) {
  if (!item) {
    throw new Error('YouTube live chat item is required for normalization.');
  }

  const sanitizeHtml = typeof options.sanitizeHtml === 'function' ? options.sanitizeHtml : safeHtml;
  const toPlainText = toPlainTextFactory(options.toPlainText);
  const includeRaw = options.includeRaw !== false;
  const transport = options.transport || null;
  const baseMeta = options.meta && typeof options.meta === 'object' ? { ...options.meta } : {};

  const snippet = item?.snippet || {};
  const author = item?.authorDetails || {};
  const publishedAt = snippet.publishedAt || new Date().toISOString();
  const timestamp = Number.isNaN(Date.parse(publishedAt)) ? Date.now() : Date.parse(publishedAt);

  const rawMessage = snippet.displayMessage || '';
  const sanitizedMessage = sanitizeHtml(rawMessage);

  const message = {
    platform: 'youtube',
    type: 'youtube',
    chatname: author.displayName || 'YouTube User',
    chatmessage: sanitizedMessage,
    chatimg: author.profileImageUrl || '',
    timestamp,
    hasDonation: Boolean(snippet.superChatDetails || snippet.superStickerDetails),
    donationAmount: snippet.superChatDetails?.amountDisplayString,
    donationCurrency: snippet.superChatDetails?.currency,
    isModerator: !!author.isChatModerator,
    isOwner: !!author.isChatOwner,
    isMember: !!author.isChatSponsor,
    event: resolveYouTubeEvent(snippet),
    previewText: rawMessage
  };

  if (includeRaw) {
    message.raw = item;
  }

  if (item?.id) {
    message.sourceId = item.id;
  }
  if (author?.channelId) {
    message.userid = author.channelId;
  }

  if (snippet.superChatDetails) {
    message.color = snippet.superChatDetails.tier || snippet.superChatDetails.tier || null;
  }
  if (snippet.superStickerDetails?.superStickerMetadata?.altText) {
    message.subtitle = snippet.superStickerDetails.superStickerMetadata.altText;
  }

  const membershipInfo = deriveYouTubeMembership(snippet, sanitizedMessage, { toPlainText });
  if (membershipInfo) {
    if (membershipInfo.membership) {
      message.membership = membershipInfo.membership;
    }
    if (membershipInfo.subtitle) {
      message.subtitle = membershipInfo.subtitle;
    }
    if (membershipInfo.event) {
      message.event = membershipInfo.event;
    }
    if (membershipInfo.previewText) {
      message.previewText = membershipInfo.previewText;
    }
    if (membershipInfo.chatmessage) {
      message.chatmessage = membershipInfo.chatmessage;
    }
    if (membershipInfo.note && !message.meta?.note) {
      // note handled separately
    }
  }

  const badges = buildYouTubeChatBadges(author, { includeMemberBadge: membershipInfo?.includeMemberBadge });
  if (badges.length) {
    message.chatbadges = badges;
  }

  const membershipMeta = membershipInfo
    ? buildYouTubeMembershipMeta(snippet, membershipInfo, { toPlainText })
    : null;

  const meta = { ...baseMeta };
  if (membershipMeta) {
    meta.membership = membershipMeta;
  }
  if (transport) {
    meta.transport = transport;
  }

  if (Object.keys(meta).length) {
    message.meta = { ...(message.meta || {}), ...meta };
  }

  return {
    message,
    meta: Object.keys(meta).length ? meta : null,
    membership: membershipInfo || null,
    note: membershipInfo?.note || null
  };
}
