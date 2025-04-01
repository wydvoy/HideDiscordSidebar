(function() {
  let sidebarHidden = false;
  let styleElement = null;
  let channelsButton = null;
  let serversButton = null;
  let channelsVisible = true;
  let serversVisible = true;

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
      createToggleButtons();
    }
  });
  
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "toggleSidebar") {
      sidebarHidden = request.hidden;
      
      if (sidebarHidden) {
        hideSidebar();
        createToggleButtons();
      } else {
        showSidebar();
        removeToggleButtons();
      }
    }
    
    sendResponse({status: "received"});
    return true;
  });
  
  function createToggleButtons() {
    if (!channelsButton) {
      channelsButton = document.createElement('button');
      channelsButton.id = 'discord-channels-button';
      channelsButton.textContent = 'Channels';
      channelsButton.style.cssText = `
        position: fixed;
        top: 10px;
        right: 90px;
        background-color: #7289da;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 6px 10px;
        font-size: 13px;
        cursor: pointer;
        z-index: 9999;
        transition: background-color 0.2s;
      `;
      
      channelsButton.addEventListener('mouseover', function() {
        this.style.backgroundColor = channelsVisible ? '#5b6eae' : '#555';
      });
      
      channelsButton.addEventListener('mouseout', function() {
        this.style.backgroundColor = channelsVisible ? '#7289da' : '#444';
      });
      
      channelsButton.addEventListener('click', function() {
        toggleChannels();
      });
      
      document.body.appendChild(channelsButton);
    }
    
    if (!serversButton) {
      serversButton = document.createElement('button');
      serversButton.id = 'discord-servers-button';
      serversButton.textContent = 'Servers';
      serversButton.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background-color: #7289da;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 6px 10px;
        font-size: 13px;
        cursor: pointer;
        z-index: 9999;
        transition: background-color 0.2s;
      `;
      
      serversButton.addEventListener('mouseover', function() {
        this.style.backgroundColor = serversVisible ? '#5b6eae' : '#555';
      });
      
      serversButton.addEventListener('mouseout', function() {
        this.style.backgroundColor = serversVisible ? '#7289da' : '#444';
      });
      
      serversButton.addEventListener('click', function() {
        toggleServers();
      });
      
      document.body.appendChild(serversButton);
    }
    
    updateButtonStates();
  }
  
  function updateButtonStates() {
    if (channelsButton) {
      channelsButton.style.backgroundColor = channelsVisible ? '#7289da' : '#444';
    }
    
    if (serversButton) {
      serversButton.style.backgroundColor = serversVisible ? '#7289da' : '#444';
    }
  }
  
  function removeToggleButtons() {
    if (channelsButton) {
      channelsButton.remove();
      channelsButton = null;
    }
    
    if (serversButton) {
      serversButton.remove();
      serversButton = null;
    }
    
    channelsVisible = true;
    serversVisible = true;
  }
  
  function toggleChannels() {
    channelsVisible = !channelsVisible;
    
    updateSidebarCSS();
    updateButtonStates();
  }
  
  function toggleServers() {
    serversVisible = !serversVisible;
    
    updateSidebarCSS();
    updateButtonStates();
  }
  
  function updateSidebarCSS() {
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = 'discord-sidebar-toggle-styles';
      document.head.appendChild(styleElement);
    }
    
    let cssContent = '';
    
    if (!channelsVisible) {
      cssContent += `
        /* Channel list selectors */
        #app-mount > div.appAsidePanelWrapper_a3002d > div.notAppAsidePanel_a3002d > div.app_a3002d > div > div.layers__960e4.layers__160d8 > div > div > div > div.content_c48ade > div.sidebar_c48ade > div.sidebarList_c48ade.sidebarListRounded_c48ade,
        .sidebarList_c48ade,
        .sidebarListRounded_c48ade,
        [class*="sidebar-"],
        nav[class*="sidebar"],
        div[class*="sidebar"],
        .container-2lgqpQ {
          display: none !important;
        }
      `;
    }
    
    if (!serversVisible) {
      cssContent += `
        /* Server list selectors */
        #app-mount > div.appAsidePanelWrapper_a3002d > div.notAppAsidePanel_a3002d > div.app_a3002d > div > div.layers__960e4.layers__160d8 > div > div > div > div.content_c48ade > div.sidebar_c48ade > nav,
        .wrapper-3NnKdC,
        .wrapper-1_HaEi,
        .wrapper-1BJsBx,
        .container-1D34oG,
        .container-1eFtFS,
        .wrapper-3Njo_c,
        div[class*="guilds-"],
        div[class*="wrapper-"][class*="guilds"],
        nav[class*="guilds-"] {
          display: none !important;
        }
      `;
    }
    
    if (!channelsVisible || !serversVisible) {
      cssContent += `
        /* Make chat full width */
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
    }
    
    styleElement.textContent = cssContent;
  }
  
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
      
      channelsVisible = false;
      serversVisible = false;
      
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
      
      channelsVisible = true;
      serversVisible = true;
    } catch (error) {
      logError("Error showing sidebar", error);
    }
  }
  
  function initialize() {
    try {
      if (document.readyState === "complete" || document.readyState === "interactive") {
        if (sidebarHidden) {
          hideSidebar();
          createToggleButtons();
        }
      } else {
        window.addEventListener("DOMContentLoaded", initialize);
      }
    } catch (error) {
      logError("Error in initialization", error);
    }
  }
  
  const observer = new MutationObserver(function(mutations) {
    if (sidebarHidden) {
      if (!document.getElementById('discord-channels-button') || !document.getElementById('discord-servers-button')) {
        createToggleButtons();
      }
      
      updateSidebarCSS();
    }
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
  
  initialize();
})();