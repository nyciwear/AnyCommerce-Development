/* **************************************************************

   Copyright 2013 Zoovy, Inc.

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

************************************************************** */



//    !!! ->   TODO: replace 'username' in the line below with the merchants username.     <- !!!

var store_nyci = function() {
	var theseTemplates = new Array('');
	var r = {

vars : {},
////////////////////////////////////   CALLBACKS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\



	callbacks : {
//executed when extension is loaded. should include any validation that needs to occur.
		init : {
			onSuccess : function()	{
				var r = false; //return false if extension won't load for some reason (account config, dependencies, etc).
				
				
//				app.u.dump('--> NYCI Ext Started');
				app.ext.store_nyci.u.bindOnclick();
				
		//		REVISIT AFTER 2014XX UPGRADE, FOR SIGN-UP BUTTON AT LOAD TIME.
		//		app.rq.push(['templateFunction','homepageTemplate','onCompletes',function(infoObj) {
		//			dump('---Got to onCompletes');
		//			if(app.ext.store_nyci.vars = "createAccount") { app.ext.store_nyci.u.goToMyAccount(); }
		//			dump(app.ext.store_nyci.vars);
		//		}]);
				
				app.rq.push(['templateFunction','companyTemplate','onCompletes',function(infoObj) {
					var $context = $(app.u.jqSelector('#'+infoObj.parentID));
					app.ext.store_nyci.u.getArticle($context,infoObj.show);
				}]);
				
			//	setTimeout(function(){
					//app.ext.store_nyci.u.loadSubCatsAsList('.sunglasses');
			//	},2000);
				
			//	app.u.loadResourceFile(['script',0,'putthepathhere.js']);
				
			//	app.rq.push(['templateFunction','homepageTemplate','onCompletes',function(infoObj) {
			//		var $context = $(app.u.jqSelector('#'+infoObj.parentID));
			//	}]);
				
				//if there is any functionality required for this extension to load, put it here. such as a check for async google, the FB object, etc. return false if dependencies are not present. don't check for other extensions.
				r = true;

				return r;
				},
			onError : function()	{
//errors will get reported for this callback as part of the extensions loading.  This is here for extra error handling purposes.
//you may or may not need it.
				app.u.dump('BEGIN admin_orders.callbacks.init.onError');
				}
			},
			
			startExtension : {
				onSuccess : function() {
					app.u.dump('app.ext.store_nyci.callbacks.startExtension started');
					if(app.ext.myRIA && app.ext.myRIA.template && app.ext.store_navcats){
						app.ext.store_nyci.u.loadSubCatsAsList('subCategoryTemplate','.sunglasses','.sunglassesDD');
						app.ext.store_nyci.u.loadSubCatsAsList('subBrandsCategoryTemplate','.eyeglasses','.eyeglassesDD');
						app.ext.store_nyci.u.loadSubCatsAsList('subBrandsCategoryTemplate','.shop_by_brand','.brandDD');
						app.u.dump('loadSubCatsAsList just ran in startExtension');
					} else	{
						setTimeout(function(){app.ext.store_nyci.callbacks.startExtension.onSuccess()},250);
						var count = 0;
						count += 1;
						app.u.dump(count);
					}
				},
				onError : function (){
					app.u.dump('BEGIN app.ext.store_nyci.callbacks.startExtension.onError');
				}
			},
			
			renderSubCatsAsList : {
				onSuccess : function(rd) {
// 					app.u.dump(app.data[rd.datapointer]);
					$(rd.element).anycontent({"templateID":rd.template,"datapointer":rd.datapointer});
				},
				onError : function(rd){
					app.u.dump('Error in extension: store_nyci_renderSubCatsAsList');
					app.u.dump(rd);
				}
			}
			
		}, //callbacks



////////////////////////////////////   ACTION    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//actions are functions triggered by a user interaction, such as a click/tap.
//these are going the way of the do do, in favor of app events. new extensions should have few (if any) actions.
		a : {
				
				//will trigger a click on the element passed in
			clickThat : function($tag) {
				$tag.triggerHandler('click');
			},
			
				//animates chat tag "right" property. 
			animateThis : function($tag,value,duration) {
				$tag.animate({'right':value},duration);
			},
			
			showSizeGuide : function() {
				$('#sizingGuideTemplate').dialog({'modal':'true', 'title':'Sizing Guide','width':'38%', 'max-height':275});
			},
		
			}, //Actions

////////////////////////////////////   RENDERFORMATS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//renderFormats are what is used to actually output data.
//on a data-bind, format: is equal to a renderformat. extension: tells the rendering engine where to look for the renderFormat.
//that way, two render formats named the same (but in different extensions) don't overwrite each other.
		renderFormats : {
		
			test : function($tag, data) {
				app.u.dump('--> Test Function'); app.u.dump(data.value);
			}

		}, //renderFormats
////////////////////////////////////   UTIL [u]   \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//utilities are typically functions that are exected by an event or action.
//any functions that are recycled should be here.
		u : {
			
			goToMyAccount : function() {
			app.u.dump('----Got to goToMyAccount'); 
				return showContent('customer',{'show':'createaccount'});
			},

			getArticle : function($context,thisPlace) {
				app.u.dump('---- Start store_nyci getArticle');  app.u.dump(thisPlace); 
				var $title = $('.articleTitle',$context);
				switch(thisPlace) {
					case "about" :
						$title.empty().text('About NyciWear');
						break;
					case "contact" :
						$title.empty().text('Contact NyciWear');
						break;
					case "faq" :
						$title.empty().text('Frequently Asked Questions');
						break;
					case "payment" :
						$title.empty().text('Payment Policy');
						break;
					case "privacy" :
						$title.empty().text('Privacy Policy');
						break;
					case "return" :
						$title.empty().text('Return Policy');
						break;
					case "shipping" :
						$title.empty().text('Shipping Policy');
					break;
					
				}
				
			},
		
			infoObjToCreateAccount : function(infoObj) {
				infoObj.datapointer = "appNavcatDetail|customer"
				infoObj.navcat = "";
				infoObj.pageType = "customer";
				infoObj.parentID = "mainContentArea_customer";
				infoObj.templateID = "customerTemplate"; 
				return infoObj;
			},
			
				//make crawl-able links
			bindOnclick : function() {
				$('body').off('click', 'a[data-onclick]').on('click', 'a[data-onclick]', function(event){
					 var $this = $(this);
					 var P = app.ext.myRIA.u.parseAnchor($this.data('onclick'));
					 return app.ext.myRIA.a.showContent('',P);
				});
			},
			
				//loads sub cat created for the header drop-downs	
			loadSubCatsAsList :function(template,passedCat,element) {
				
				var _tag = {
					"callback"	: "renderSubCatsAsList",
					"extension"	: "store_nyci",
					"element"	: element,	//the element to put the sub cat in
					"template"	: template
				}
				app.ext.store_navcats.calls.appNavcatDetailMax.init(passedCat, _tag,'immutable');
	
				app.model.dispatchThis('immutable');
			
			}, //loadSubCatsAsList
		
		}, //u [utilities]

//app-events are added to an element through data-app-event="extensionName|functionName"
//right now, these are not fully supported, but they will be going forward. 
//they're used heavily in the admin.html file.
//while no naming convention is stricly forced, 
//when adding an event, be sure to do off('click.appEventName') and then on('click.appEventName') to ensure the same event is not double-added if app events were to get run again over the same template.
		e : {
			} //e [app Events]
		} //r object.
	return r;
	}