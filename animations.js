
/* We need to create dynamic keyframes to show the animation from full-screen to normal. So we create a stylesheet in which we can insert CSS keyframe rules */
$("body").append('<style id="lightbox-animations" type="text/css"></style>');

/* Click on the container */
$(".column").on('click', function() {
	/* The position of the container will be set to fixed, so set the top & left properties of the container */

	var bounding_box = $(this).get(0).getBoundingClientRect();
	$(this).css({ top: bounding_box.top + 'px', left: bounding_box.left -20+ 'px' });

	/* Set container to fixed position. Add animation */
	$(this).addClass('in-animation');

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
	$("#lightbox-animations").get(0).sheet.insertRule(styles, 0);

	/* Hide the window scrollbar */
	$("body").css('overflow', 'hidden');
});

/* Click on close button when full-screen */
$(".close").on('click', function(e) {
$(this).hide();
$(".container-inner").hide();
/* Window scrollbar normal */
$("body").css('overflow', 'auto');

var bounding_box = $(this).parent().get(0).getBoundingClientRect();
$(this).parent().css({ top: bounding_box.top + 'px', left: bounding_box.left + 'px' });

/* Show animation */
$(this).parent().addClass('out-animation');

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
$(this).removeClass('in-animation').removeClass('out-animation').removeClass('columnfade');

/* Remove the empty container that was earlier added */
$("#empty-container").remove();

/* Delete the dynamic keyframe rule that was earlier created */
$("#lightbox-animations").get(0).sheet.deleteRule(0);
}
});


// multiselect dropdowns
$('#audioSource').on('mousedown touchend focusin focusout', function(e) {
    var state = $('.multiselect-trigger').data('state') || 0;
    if( state == 0 ) {
        // open the dropdown
        $('.multiselect-trigger').data('state', '1').addClass('open').removeClass('closed');
        $('.multiselect-trigger').find('.chevron').removeClass('bottom'); 
        $('.multiselect-trigger').parent().find('.multiselect-contents').show();
		$('.multiselect-trigger').parent().find('.multiselect-contents').find('input[type="checkbox"]').parent().show();;
		$('.multiselect-trigger').parent().find('.multiselect-contents').find('input[type="checkbox"]').show();;
    } 
    e.preventDefault();
});
 
// multiselect dropdowns
$('.multiselect-trigger').on('mousedown touchend focusin focusout', function(e) {
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
        //$(this).parent().find('.multiselect-contents').hide();
		//$(this).parent().find('.multiselect-contents').find('input[type="checkbox"]').hide();
		$(this).parent().find('.multiselect-contents').find('input[type="checkbox"]').not(":checked").parent().hide();;
		$(this).parent().find('.multiselect-contents').find('input[type="checkbox"]').hide();;
    } 
    e.preventDefault();
});


// when no preference is checked, uncheck the others
$('#multiselect1').on('change', function(e) {
    if( $(this).is(':checked') ) {
        $(this).parent().parent().find('input[type="checkbox"]').not('#multiselect1').prop('checked', false);
    }
    e.preventDefault();
});
 
