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

var store_nyci = function(_app) {
	var theseTemplates = new Array('');
	var r = {

vars : {},
////////////////////////////////////   CALLBACKS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\



	callbacks : {
//executed when extension is loaded. should include any validation that needs to occur.
		init : {
			onSuccess : function()	{
				var r = false; //return false if extension won't load for some reason (account config, dependencies, etc).
				
				
//				_app.u.dump('--> NYCI Ext Started');
	//			_app.ext.store_nyci.u.bindOnclick();
				
		//		REVISIT AFTER 2014XX UPGRADE, FOR SIGN-UP BUTTON AT LOAD TIME.
		//		app.rq.push(['templateFunction','homepageTemplate','onCompletes',function(infoObj) {
		//			dump('---Got to onCompletes');
		//			if(app.ext.store_nyci.vars = "createAccount") { app.ext.store_nyci.u.goToMyAccount(); }
		//			dump(app.ext.store_nyci.vars);
		//		}]);

				
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
				_app.u.dump('BEGIN admin_orders.callbacks.init.onError');
				}
			},
			
			startExtension : {
				onSuccess : function() {
					_app.u.dump('_app.ext.store_nyci.callbacks.startExtension started');
					
					if(_app.ext.quickstart && _app.templates && _app){
						_app.ext.store_nyci.u.loadSubCatsAsList('subCategoryTemplate','.sunglasses','.sunglassesDD');
						_app.ext.store_nyci.u.loadSubCatsAsList('subBrandsCategoryTemplate','.eyeglasses','.eyeglassesDD');
						_app.ext.store_nyci.u.loadSubCatsAsList('subBrandsCategoryTemplate','.shop_by_brand','.brandDD');
//						_app.u.dump('loadSubCatsAsList just ran in startExtension');
						
						setTimeout(function() {
							//delaying load on these helps w/ initial page render time. Time can use some tweaking before it's optimal. (last test was 10 secs)
							_app.ext.store_nyci.u.addBillMeLater($(".ppFinancingHeader"),{"LW":"800","LH":"66","MW":"468","MH":"60","SW":"234","SH":"60"});
							_app.ext.store_nyci.u.addBillMeLater($(".ppFinancingFooter"),{"LW":"120","LH":"90","MW":"120","MH":"90","SW":"120","SH":"90"});
						},5000);
						
						_app.templates.homepageTemplate.on('complete.store_nyci',function(event,$context,infoObj) {
							_app.ext.store_nyci.u.showSignUp($context);
						});
						
						_app.templates.productTemplate.on('complete.store_nyci',function(event,$context,infoObj) {
							_app.ext.store_nyci.u.addBillMeLater($(".ppFinancingProduct",$context),{"LW":"120","LH":"90","MW":"120","MH":"90","SW":"120","SH":"90"});
						});
						
						_app.templates.companyTemplate.on('complete.store_nyci',function(event,$context,infoObj) {
							_app.ext.store_nyci.u.getArticle($context,infoObj.show);
						});
					
					} else	{
						setTimeout(function(){ _app.ext.store_nyci.callbacks.startExtension.onSuccess() },250);
					}
					
				},
				onError : function (){
					_app.u.dump('BEGIN _app.ext.store_nyci.callbacks.startExtension.onError');
				}
			},
			
			renderSubCatsAsList : {
				onSuccess : function(rd) {
// 					_app.u.dump(_app.data[rd.datapointer]);dump(rd.datapointer);
					$(rd.element).tlc({"templateid":rd.template,"datapointer":rd.datapointer,verb:"transmogrify"});
				},
				onError : function(rd){
					_app.u.dump('Error in extension: store_nyci_renderSubCatsAsList');
					_app.u.dump(rd);
				}
			}
			
		}, //callbacks



////////////////////////////////////   ACTION    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//actions are functions triggered by a user interaction, such as a click/tap.
//these are going the way of the do do, in favor of app events. new extensions should have few (if any) actions.
		a : {
		
			slideThatUp : function($tag) {
				dump('slideItUp triggered');
				$tag.slideUp();
			},
				
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
			
////////////////////////////////////   TLCFORMATS   \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
			
		tlcFormats : {
		
				//works like the quickstart version, but you can pass whatever filter you want which allows multiple parameters, AND/OR, etc.
			searchbytag : function(data,thisTLC) {
				var argObj = thisTLC.args2obj(data.command.args,data.globals); //this creates an object of the args
					//check if there is a $var value to replace in the filter object (THERE IS PROBABLY A BETTER WAY TO DO THIS)
				if(argObj.replacify) {argObj.filter = argObj.filter.replace('replacify',data.value);}
	//			dump(argObj.replacify);
				var query = JSON.parse(argObj.filter);
	//	dump('----search by tag'); dump(data.value); dump(argObj.filter); dump(query);
				_app.ext.store_search.calls.appPublicProductSearch.init(query,$.extend({'datapointer':'appPublicSearch|tag|'+argObj.tag,'templateID':argObj.templateid,'extension':'store_search','callback':'handleElasticResults','list':data.globals.tags[data.globals.focusTag]},argObj));
				_app.model.dispatchThis('mutable');
				return false; //in this case, we're off to do an ajax request. so we don't continue the statement.
			}
			
		},
			

////////////////////////////////////   RENDERFORMATS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//renderFormats are what is used to actually output data.
//on a data-bind, format: is equal to a renderformat. extension: tells the rendering engine where to look for the renderFormat.
//that way, two render formats named the same (but in different extensions) don't overwrite each other.
		renderFormats : {
		
			test : function($tag, data) {
				_app.u.dump('--> Test Function'); _app.u.dump(data.value);
			}

		}, //renderFormats
////////////////////////////////////   UTIL [u]   \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//utilities are typically functions that are exected by an event or action.
//any functions that are recycled should be here.
		u : {
		
			//shows modal asking user to create an account after app load. Only shows on first homepage view on non-secure
			showSignUp : function($context) {
				if(!$context.data('no-sign-up')) { //if it hasn't been shown before, show it.
					if(document.location.protocol !== 'https:') { //if on secure, skip it (prevents showing on switch to secure for login/checkout)
						var $parent = $('#signUpTemplate');
						var w = '32%';
						var win = $(window).width();
						if (win < 720) { w = '80%'; }
						else if (win < 900) { w = '60%'; }
						else if (win < 1100) { w = '50%'; }
						else {} //leave width at default
//						dump('WINDOW dimensions are:'); dump($(window).height()); dump($(window).width());
						$parent.dialog({
							'modal'		:'true',
							'title'		:'Sign-up with NyciWear',
							'width'		:w, 
							'max-height':275,
							open : function(event, ui){ 
								$('.ui-widget-overlay').on('click.closeModal', function(){$parent.dialog('close')});
								$('[data-popup-login]',$parent).on('click.closeModal', function(){$parent.dialog('close')});
								$('[data-popup-bypass]',$parent).on('click.closeModal', function(){$parent.dialog('close')});
							},
							close : function(event, ui){ 
								$('.ui-widget-overlay').off('click.closeModal');
								$('[data-popup-login]',$parent).off('click.closeModal');
								$('[data-popup-bypass]',$parent).off('click.closeModal');
							}
						});
						$context.data('no-sign-up',true); //it's been seen, set condition to prevent additional showing.
					}
				}
			},

			//appends Paypal bill me later script to the element passed as $container using the size passes as placementType.
			addBillMeLater : function($container, dimensions) {
//				dump('bill me later object:'); dump(dimensions.LW); dump(dimensions.LH); dump(dimensions.MW); dump(dimensions.MH); dump(dimensions.SW); dump(dimensions.SH);
				var placementType = dimensions.LW+"x"+dimensions.LH;
				var continerSize = {"width":dimensions.LW,"height":dimensions.LH};
				var win = $(window).width();
				if(win < 480) {
					placementType = dimensions.SW+"x"+dimensions.SH;
					continerSize.width = dimensions.SW; 
					continerSize.height = dimensions.SH
				}
				else if(win < 800) {
					placementType = dimensions.MW+"x"+dimensions.MH;
					continerSize.width = dimensions.MW; 
					continerSize.height = dimensions.MH
				}
				else {} //Large dimension originally assigned will be used at res over 800 wide
			
				var script = document.createElement("script");
				script.type = "text/javascript";
				script.setAttribute("data-pp-pubid","1a46db62a0");
				script.setAttribute("data-pp-placementtype",placementType);
				script.text = '(function (d, t) {'
				+	'"use strict";'
				+	'var s = d.getElementsByTagName(t)[0], n = d.createElement(t);'
				+	'n.src = "//paypal.adtag.where.com/merchant.js";'
				+	's.parentNode.insertBefore(n, s);'
				+	'}(document, "script"));';
				
				$container.append(script);
				//$container.css(continerSize);
				$container.animate(continerSize,500);
			},
			
			goToMyAccount : function() {
			_app.u.dump('----Got to goToMyAccount'); 
				return showContent('customer',{'show':'createaccount'});
			},

			getArticle : function($context,thisPlace) {
				_app.u.dump('---- Start store_nyci getArticle');  _app.u.dump(thisPlace); 
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
					 var P = _app.ext.quickstart.u.parseAnchor($this.data('onclick'));
					 return _app.ext.quickstart.a.showContent('',P);
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
				_app.calls.appNavcatDetail.init({"path":passedCat,"detail":"max"}, _tag,'immutable');
	
				_app.model.dispatchThis('immutable');
			
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