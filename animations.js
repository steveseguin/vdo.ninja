$("body").append('<style id="lightbox-animations" type="text/css"></style>');
$(".column").on('click', function() {
	if ( $(this).hasClass( "skip-animation" )){
		return;
	}
	var bounding_box = $(this).get(0).getBoundingClientRect();
	$(this).css({ top: bounding_box.top + 'px', left: bounding_box.left -20+ 'px' });
	$(this).addClass('in-animation').removeClass('pointer');
	$("#empty-container").remove();
	$('<div id="empty-container" class="column"></div>').insertAfter(this);

	var styles = '';
	styles = '@keyframes outlightbox {';
	styles += '0% {';
	styles += 'height: 100%;';
	styles += 'width: 100%;';
	styles += 'top: 0px;';
	styles += 'left: 0px;';
	styles += '}';
	styles += '50% {';
	styles += 'height: 200px;';
	styles += 'top: ' + bounding_box.y + 'px;';
	styles += '}';
	styles += '100% {';
	styles += 'height: 200px;';
	styles += 'width: '+bounding_box.width+'px;';
	styles += 'top: ' + bounding_box.y + 'px;';
	styles += 'left: ' + bounding_box.x + 'px;';
	styles += '}';
	styles += '}';

	$("#lightbox-animations").empty();
	$("#lightbox-animations").get(0).sheet.insertRule(styles, 0);
	$("body").css('overflow', 'hidden');
});

$(".close").on('click', function(e) {
	$(this).hide();
	$(".container-inner").hide();
	$("body").css('overflow', 'auto');
	var bounding_box = $(this).parent().get(0).getBoundingClientRect();
	$(this).parent().css({ top: bounding_box.top + 'px', left: bounding_box.left + 'px' });
	$(this).parent().addClass('out-animation');
	cleanupMediaTracks(); 
	e.stopPropagation();
});

$(".column").on('animationend', function(e){
	if (e.originalEvent.animationName == 'inlightbox') {
		$(this).children(".close").show();
		$(this).children(".container-inner").show();
	}
	else if (e.originalEvent.animationName == 'outlightbox') {
		$(this).removeClass('in-animation').removeClass('out-animation').removeClass('columnfade').addClass('pointer');
		$("#empty-container").remove();
		$("#lightbox-animations").get(0).sheet.deleteRule(0);
	}
});


$('#audioSource').on('mousedown touchend focusin focusout', function(e) {
     var state = $('#multiselect-trigger').data('state') || 0;
     if( state == 0 ) {
        $('#multiselect-trigger').data('state', '1').addClass('open').removeClass('closed');
        $('#multiselect-trigger').find('.chevron').removeClass('bottom'); 
        $('#multiselect-trigger').parent().find('.multiselect-contents').show();
		$('#multiselect-trigger').parent().find('.multiselect-contents').find('input[type="checkbox"]').parent().show();;
		$('#multiselect-trigger').parent().find('.multiselect-contents').find('input[type="checkbox"]').show();;
    } 
});

$('#audioSource3').on('mousedown touchend focusin focusout', function(e) {
     var state = $('#multiselect-trigger3').attr('data-state') || 0;
     if( state == 0 ) {
        $('#multiselect-trigger3').attr('data-state', '1').addClass('open').removeClass('closed');
        $('#multiselect-trigger3').find('.chevron').removeClass('bottom'); 
        $('#multiselect-trigger3').parent().find('.multiselect-contents').show();
		$('#multiselect-trigger3').parent().find('.multiselect-contents').find('input[type="checkbox"]').parent().show();;
		$('#multiselect-trigger3').parent().find('.multiselect-contents').find('input[type="checkbox"]').show();;
    } 
});
 
$('#multiselect-trigger').on('mousedown touchend focusin focusout', function(e) {
    var state = $(this).data('state') || 0;
    if( state == 0 ) {
        // open the dropdown
        $(this).data('state', '1').addClass('open').removeClass('closed');
        $(this).find('.chevron').removeClass('bottom');
        $(this).parent().find('.multiselect-contents').show();
		$(this).parent().find('.multiselect-contents').find('input[type="checkbox"]').parent().show();;
		$(this).parent().find('.multiselect-contents').find('input[type="checkbox"]').show();;
    } else {
        // close the dropdown
        $(this).data('state', '0').addClass('closed').removeClass('open');
        $(this).find('.chevron').addClass('bottom');
		$(this).parent().find('.multiselect-contents').find('input[type="checkbox"]').not(":checked").parent().hide();;
		$(this).parent().find('.multiselect-contents').find('input[type="checkbox"]').hide();;
    } 
    e.preventDefault();
});
// multiselect dropdowns
$('#multiselect-trigger3').on('mousedown touchend focusin focusout', function(e) {
    var state = $(this).attr('data-state') || 0;
	
    if( state == 0 ) {
        // open the dropdown
		errorlog("STATE: "+state);
        $(this).attr('data-state', '1').addClass('open').removeClass('closed');
        $(this).find('.chevron').removeClass('bottom');
        $(this).parent().find('.multiselect-contents').show();
		$(this).parent().find('.multiselect-contents').find('input[type="checkbox"]').parent().show();;
		$(this).parent().find('.multiselect-contents').find('input[type="checkbox"]').show();;
    } else {
        // close the dropdown
        $(this).attr('data-state', '0').addClass('closed').removeClass('open');
        $(this).find('.chevron').addClass('bottom');
		$(this).parent().find('.multiselect-contents').find('input[type="checkbox"]').not(":checked").parent().hide();;
		$(this).parent().find('.multiselect-contents').find('input[type="checkbox"]').hide();;
    } 
    e.preventDefault();
});
