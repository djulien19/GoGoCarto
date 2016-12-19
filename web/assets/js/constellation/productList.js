/**
 * This file is part of the MonVoisinFaitDuBio project.
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2016 Sebastian Castro - 90scastro@gmail.com
 * @license    MIT License
 * @Last Modified time: 2016-12-13
 */
var slideOptions = { duration: 500, easing: "easeOutQuart", queue: false, complete: function() {}};

jQuery(document).ready(function()
{
if (constellationMode)	
{
	// MODE StarRepresentationChoice
	$('.productItem:not(.disabled)').click(function()
	{
		var star = App.getConstellation().getStarFromName($(this).attr('data-star-name'));
		
		var moreResultContainer = $(this).parent().find('.moreResultContainer');
		
		// if the moreResultContainer si already visible
		if (moreResultContainer.hasClass("active")) 
		{
			moreResultContainer.stop(true,false).slideUp(slideOptions);
			moreResultContainer.removeClass("active");
			App.getSRCManager().end();
		}
		else
		{
			clearProductList();
			App.getSRCManager().end();
			
			if ($('#ProductsList').outerWidth() == $(window).outerWidth())
			{
				if (! moreResultContainer.find('.see-more-result-on-map').length)
				{
					moreResultContainer.prepend('<div class="see-more-result-on-map">Voir sur la carte</div>');
					moreResultContainer.find('.see-more-result-on-map').click(hideProductsList);
				}
			}

			moreResultContainer.stop(true,false).slideDown(slideOptions);
			moreResultContainer.addClass("active");
			App.getSRCManager().begin(star);	

			if ($(this).attr('data-elements-size') == 1)
			{			
				showElementInfosOnMap(star.getElementId(), false);
			}
			else
			{
				var that = this;
				setTimeout(function() 
				{
					$('#ProductsList').animate({scrollTop: '+='+$(that).position().top}, 500);
				}, 400);
				animate_down_bandeau_detail();
			}		
		}		
	});

	// Click sur un des choix des représentants de l'étoile
	$('.moreResultElementItem').click(function() { App.getSRCManager().selectElementIndex( $(this).attr('data-element-index') ); });

	// Gestion hover pour la liste de produit
	$('.productItem:not(.disabled)').mouseenter(function() 
	{
		if (App.getState() == 'starRepresentationChoice') return;
		var star = App.getConstellation().getStarFromName($(this).attr('data-star-name'));
		star.getMarker().showBigSize();
	}).mouseleave(function() 
	{
		if (App.getState() == 'starRepresentationChoice') return;
		var star = App.getConstellation().getStarFromName($(this).attr('data-star-name'));
		star.getMarker().showNormalSize();
	});

	// Gestion hover pour le choix du réprésentant de l'étoile
	$('.moreResultElementItem, .elementItem').mouseenter(function() 
	{
		var marker = App.getMarkerManager().getMarkerById($(this).attr('data-element-id'));
		marker.showBigSize();
	}).mouseleave(function() 
	{
		var marker = App.getMarkerManager().getMarkerById($(this).attr('data-element-id'));
		marker.showNormalSize();
	});

	$('#search_distance').change(function() { $("#search_distance_value").text($(this).val()); });
}
});

function clearProductList()
{
	var otherContainerVisible = $('.moreResultContainer.active').first();
	otherContainerVisible.stop(true,false).slideUp(slideOptions);
	otherContainerVisible.removeClass("active");
}
