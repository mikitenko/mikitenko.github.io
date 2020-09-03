(function(){

    "use strict";
    
    if(window.R8CT) // Already Loaded
    {
        console.log("R8 Loaded Already.");
        return false;
    }
    
    window.R8CT = {};
    
    var cached_stores = [];
    var cached_display_types = {};
    var listeners = {};
    var useStoresOnly = [];
    var geo_radius = 100;
    var geo_expires = 60;
    
    var startup_callback = null;
    var use_geo_strategy = null;
    var use_features = null;
    var use_store_filters = null;
    
    function importScript(options)
    {
        var headElement = document.getElementsByTagName('head')[0];

        try
        {
            var script= document.createElement('script');
            script.type= 'text/javascript';
            script.async = true;

            if(options.data)
            {
                for(var p in options.data)
                {
                    script.setAttribute("data-"+p, options.data[p]);
                }
            }

            if(!options.callback)
                options.callback = function(){  };

                if(script.attachEvent)
                {
                    script.attachEvent("onreadystatechange", function(){ if(script.readyState=="loaded"){options.callback({success: true});} });
                    script.attachEvent("error", function(){ options.callback({success: false}); }, true);
                }
                else
                {
                    script.onload = function(){ options.callback({success: true}); };
                    script.addEventListener('error', function(){ options.callback({success: false}); }, true);
                }
                
                if(options.url)
                    script.src = options.url;
                else if(options.code)
                    script.text = options.code;

                headElement.appendChild(script);
        }
        catch(e)
        {
            console.log("Issue Importing[" + e + "]", e);
        }
    }

    function tt()
    {
        return new Date().getTime();
    }
    
    function onScriptReady()
    {
    }
    
    function loadConnect()
    {
        /////preload querystring parameters
        var selfScript = null;
        var scripts = document.getElementsByTagName("script");
        var scriptURL = null;
        for (var i = 0; i < scripts.length; ++i) 
        {
            var testscript = scripts[i];
            var src = testscript.getAttribute('src');
            if(src && src.indexOf("sdk/v1/r8_connect.js?") > 0)
            {
                scriptURL = testscript.getAttribute('src');
                break;
            }
        }
        
        if(scriptURL==null)
        {
            console.log("R8Connect Could Not Load Parameters.");
            return;
        }
        else
        {
            var qp = scriptURL.split("?")[1];
            var baseurl = null;
            if(qp)
            {
                var parts = scriptURL.split("/sdk/");
                if(parts.length > 1)
                {
                    baseurl = parts[0];
                }
                
                qp = qp.indexOf('&') == 0 ? qp : "&" + qp;
            }
            
            if(qp && baseurl)
                importScript({url: baseurl + "/sdk/v1/r8rt?tsv="+tt()+qp, callback: onScriptReady});
        }
    }
    
    loadConnect();
    
})();
