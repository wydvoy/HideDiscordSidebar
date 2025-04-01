(function() {
  let sidebarHidden = false;
  let styleElement = null;

  function log(message) {
    console.log(`Discord Sidebar Toggle: ${message}`);
  }
  
  function logError(message, error) {
    console.error(`Discord Sidebar Toggle: ${message}`, error);
  }

  chrome.storage.sync.get(['sidebarHidden'], function(data) {
    sidebarHidden = data.sidebarHidden || false;
    
    if (sidebarHidden) {
      hideSidebar();
    }
  });
  
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "toggleSidebar") {
      sidebarHidden = request.hidden;
      
      if (sidebarHidden) {
        hideSidebar();
      } else {
        showSidebar();
      }
    }
    
    sendResponse({status: "received"});
    return true;
  });
  
  function hideSidebar() {
    try {
      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = 'discord-sidebar-toggle-styles';
        document.head.appendChild(styleElement);
      }
      
      styleElement.textContent = `
        /* Target common Discord sidebar selectors */
        #app-mount > div.appAsidePanelWrapper_a3002d > div.notAppAsidePanel_a3002d > div.app_a3002d > div > div.layers__960e4.layers__160d8 > div > div > div > div.content_c48ade > div.sidebar_c48ade,
        [class*="sidebar-"],
        nav[class*="sidebar"],
        div[class*="sidebar"],
        .container-2lgqpQ,
        div[class*="guilds-"],
        div[class*="wrapper-"][class*="guilds"],
        nav[class*="guilds-"],
        .wrapper-3NnKdC,
        .wrapper-1_HaEi,
        .wrapper-1BJsBx,
        .container-1D34oG,
        .container-1eFtFS,
        .wrapper-3Njo_c {
          display: none !important;
        }
        
        [class*="chat-"],
        div[class*="chatContent"],
        main[class*="chatContent"],
        div[class*="content-"],
        .base-3dtUhz,
        .container-1D34oG {
          width: 100% !important;
          max-width: 100% !important;
          margin-left: 0 !important;
        }
      `;
      
      log("Sidebar hidden");
    } catch (error) {
      logError("Error hiding sidebar", error);
    }
  }
  
  function showSidebar() {
    try {
      if (styleElement) {

        styleElement.textContent = '';
        log("Sidebar shown");
      }
    } catch (error) {
      logError("Error showing sidebar", error);
    }
  }
  
  function initialize() {
    try {

      if (document.readyState === "complete" || document.readyState === "interactive") {
        if (sidebarHidden) {
          hideSidebar();
        }
      } else {

        window.addEventListener("DOMContentLoaded", initialize);
      }
    } catch (error) {
      logError("Error in initialization", error);
    }
  }
  
  initialize();
})();