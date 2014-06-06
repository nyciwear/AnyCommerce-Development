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



var store_seo = function(_app) {
	var theseTemplates = new Array('');
	var r = {


////////////////////////////////////   CALLBACKS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

	vars : {
		defaultTitle : "Discount Designer Sunglasses Satisfaction Guaranteed at NyciWear", //Should not include any Prefix or Postfix
		titlePrefix : "",
		titlePostfix : ""
		},

	callbacks : {
//executed when extension is loaded. should include any validation that needs to occur.
		init : {
			onSuccess : function()	{
				var r = false; 
				
		//		_app.templates.homepageTemplate.on('complete',	function(event,$context,infoObj){_app.ext.store_seo.u.generateMeta(infoObj);});
		//		_app.templates.categoryTemplate.on('complete',	function(event,$context,infoObj){_app.ext.store_seo.u.generateMeta(infoObj);});
		//		_app.templates.productTemplate.on('complete',	function(event,$context,infoObj){_app.ext.store_seo.u.generateMeta(infoObj);});
		//		_app.templates.companyTemplate.on('complete',	function(event,$context,infoObj){_app.ext.store_seo.u.generateMeta(infoObj);});
		//		_app.templates.customerTemplate.on('complete',	function(event,$context,infoObj){_app.ext.store_seo.u.generateMeta(infoObj);});
		//		_app.templates.checkoutTemplate.on('complete',	function(event,$context,infoObj){_app.ext.store_seo.u.generateMeta(infoObj);});
		//		_app.templates.cartTemplate.on('complete',		function(event,$context,infoObj){_app.ext.store_seo.u.generateMeta(infoObj);});
		//		_app.templates.searchTemplate.on('complete',	function(event,$context,infoObj){_app.ext.store_seo.u.generateMeta(infoObj);});
				
				r = true;

				return r;
				},
			onError : function()	{
				_app.u.dump('BEGIN store_seo.callbacks.init.onError');
				}
			},
			
			attachHandlers : {
				onSuccess : function() {
//					_app.u.dump('BEGIN store_seo.callbacks.attachHandlers.onSuccess');
//					dump(_app.templates);
					var callback = function(event, $context, infoObj){dump('--> store_seo complete event'); event.stopPropagation(); if(infoObj){_app.ext.store_seo.u.generateMeta($context, infoObj);}}
					for(var i in _app.templates){
						_app.templates[i].on('complete.seo', callback);
					}
					$('#appTemplates').children().each(function() {
						$(this).on('complete.seo', callback);
					});
				},
				onError : function() {
					_app.u.dump('BEGIN store_seo.callbacks.attachHandlers.onError');
				}
			}
		}, //callbacks



////////////////////////////////////   ACTION    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

		a : {

			}, //Actions

////////////////////////////////////   RENDERFORMATS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

		renderFormats : {

			}, //renderFormats
////////////////////////////////////   UTIL [u]   \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

		u : {
			generateMeta : function($context, infoObj){
				var baseTitle = '';
				var desc = '';
//				dump('generateMeta page type:');dump(infoObj.pageType);
				switch(infoObj.pageType){
					case "homepage" :
						//empty and add break to use default title.
						//seo title and desc have been hardcoded to homepage for now because pages.json isn't being populated for "."
					case "category" :
					case "product" :
						baseTitle = $('[data-seo-title]', $context).attr('data-seo-title');
						desc = $('[data-seo-desc]', $context).attr('data-seo-desc');
						break;
					case "company" :
					case "customer" :
//						dump('GENERATE META COMPANY/CUSTOMER CASE RUNNING');
						if(infoObj.show) {
//							dump('SHOW = '); dump(infoObj.show); 
							var page = infoObj.show
							baseTitle = infoObj.show == 'logout' ? _app.ext.store_seo.vars.defaultTitle : $('[data-seo-title-'+page+']', $context).attr('data-seo-title-'+page);
							desc = $('[data-seo-desc-'+page+']', $context).attr('data-seo-desc-'+page);
							break;
						}
						else { 	
							dump('Missing page data in store_seo.u.generateMeta() for company/customer article.'); //no infoObj.show to know what page to set data for. 
							break;
						}
					case "checkout" :
//						dump('Checkout infoObj:'); dump(infoObj.pageType); 
						baseTitle = "Checkout at NyciWear";
						desc =  "Discount Designer Sunglasses and Eyeglasses, Prada, Ray-ban, Tom ford, Carrera, Tory Burch and more at nycIwear.com. "
							+	"Always Free shipping, 20-50% off and a hassle free 30 day return/exchange policy.";
						break;
					case "cart" :
						if(_app.data["cartDetail|"+_app.model.fetchCartID()]) {
							var L = _app.data["cartDetail|"+_app.model.fetchCartID()]["@ITEMS"].length;
							var item = L > 1 ? "items" : "item";
							baseTitle = "You have "+L+" "+item+" in your shopping cart at NyciWear"
						}
						else { baseTitle = "Shopping Cart at NyciWear"; }
						desc = $('[data-seo-desc-'+infoObj.pageType+']', $context).attr('data-seo-desc-'+infoObj.pageType);
//						dump('CART META DECSRIPTION:'); dump(desc);
						break;
					case "search" :
						break;
					default :
						break;
					}
				if(!baseTitle){
					baseTitle = _app.ext.store_seo.vars.defaultTitle;
					}
				
				document.title = _app.ext.store_seo.vars.titlePrefix + baseTitle + _app.ext.store_seo.vars.titlePostfix;
				$('meta[name=description]').attr('content', desc);
				}
			}, //u [utilities]

		e : {
			} //e [app Events]
		} //r object.
	return r;
	}
