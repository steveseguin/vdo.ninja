
/* We need to create dynamic keyframes to show the animation from full-screen to normal. So we create a stylesheet in which we can insert CSS keyframe rules */
$("body").append('<style id="lightbox-animations" type="text/css"></style>');

/* Click on the container */
$(".column").on('click', function() {
	/* The position of the container will be set to fixed, so set the top & left properties of the container */

	if ( $(this).hasClass( "skip-animation" )){
		return;
	}
	

	var bounding_box = $(this).get(0).getBoundingClientRect();
	$(this).css({ top: bounding_box.top + 'px', left: bounding_box.left -20+ 'px' });

	/* Set container to fixed position. Add animation */
	$(this).addClass('in-animation').removeClass('pointer');

	/* An empty container has to be added in place of the lightbox container so that the elements below don't come up
	Dimensions of this empty container is the same as the original container */
	$("#empty-container").remove();
	$('<div id="empty-container" class="column"></div>').insertAfter(this);

	/* To animate the container from full-screen to normal, we need dynamic keyframes */
	var styles = '';
	styles = '@keyframes outlightbox {';
	styles += '0% {';
	styles += 'height: 100%;';
	styles += 'width: 100%;';
	styles += 'top: 0px;';
	styles += 'left: 0px;';
	styles += '}';
	styles += '50% {';
	styles += 'height: 220px;';
	styles += 'top: ' + bounding_box.y + 'px;';
	styles += '}';
	styles += '100% {';
	styles += 'height: 220px;';
	styles += 'width: '+bounding_box.width+'px;';
	styles += 'top: ' + bounding_box.y + 'px;';
	styles += 'left: ' + bounding_box.x + 'px;';
	styles += '}';
	styles += '}';

	/* Add keyframe to CSS */
	$("#lightbox-animations").empty();
	$("#lightbox-animations").get(0).sheet.insertRule(styles, 0);

	/* Hide the window scrollbar */
	$("body").css('overflow', 'hidden');
});


/* Click on close button when full-screen */
$(".close").on('click', function(e) {
	$(this).hide();
	$(".container-inner").hide();
	
	$("body").css('overflow', 'auto');

	var bounding_box = $(this).parent().get(0).getBoundingClientRect();
	$(this).parent().css({ top: bounding_box.top + 'px', left: bounding_box.left + 'px' });

	/* Show animation */
	$(this).parent().addClass('out-animation');


	try{
		
		var oldstream = getById('previewWebcam').srcObject;
		
		if (oldstream){
			log("old stream found");
			oldstream.getTracks().forEach(function(track) {
				track.stop();
				oldstream.removeTrack(track);
				log("stopping old track");
			});
		}
		activatedPreview=false;
	} catch (e){
		errorlog(e);
	}
	log("Cleaned up Video");
	e.stopPropagation();
});

/* On animationend : from normal to full screen & full screen to normal */
$(".column").on('animationend', function(e) {
/* On animation end from normal to full-screen */
if(e.originalEvent.animationName == 'inlightbox') {
	$(this).children(".close").show();
	$(this).children(".container-inner").show();
}
/* On animation end from full-screen to normal */
else if(e.originalEvent.animationName == 'outlightbox') {
	/* Remove fixed positioning, remove animation rules */
	$(this).removeClass('in-animation').removeClass('out-animation').removeClass('columnfade').addClass('pointer');
	
	/* Remove the empty container that was earlier added */
	$("#empty-container").remove();

	/* Delete the dynamic keyframe rule that was earlier created */
	$("#lightbox-animations").get(0).sheet.deleteRule(0);
}
});


$('#audioSource').on('mousedown touchend focusin focusout', function(e) {
     var state = $('#multiselect-trigger').data('state') || 0;
     if( state == 0 ) {
        ////open the dropdown
        $('#multiselect-trigger').data('state', '1').addClass('open').removeClass('closed');
        $('#multiselect-trigger').find('.chevron').removeClass('bottom'); 
        $('#multiselect-trigger').parent().find('.multiselect-contents').show();
		$('#multiselect-trigger').parent().find('.multiselect-contents').find('input[type="checkbox"]').parent().show();;
		$('#multiselect-trigger').parent().find('.multiselect-contents').find('input[type="checkbox"]').show();;
    } 
    // e.preventDefault();
});

$('#audioSource3').on('mousedown touchend focusin focusout', function(e) {
     var state = $('#multiselect-trigger3').attr('data-state') || 0;
     if( state == 0 ) {
        ////open the dropdown
        $('#multiselect-trigger3').attr('data-state', '1').addClass('open').removeClass('closed');
        $('#multiselect-trigger3').find('.chevron').removeClass('bottom'); 
        $('#multiselect-trigger3').parent().find('.multiselect-contents').show();
		$('#multiselect-trigger3').parent().find('.multiselect-contents').find('input[type="checkbox"]').parent().show();;
		$('#multiselect-trigger3').parent().find('.multiselect-contents').find('input[type="checkbox"]').show();;
    } 
    // e.preventDefault();
});
 
// multiselect dropdowns
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



 
