document.addEventListener('DOMContentLoaded', function() {
  const sidebarToggle = document.getElementById('sidebarToggle');
  const statusText = document.getElementById('status');
  
  chrome.storage.sync.get(['sidebarHidden'], function(data) {
    sidebarToggle.checked = data.sidebarHidden || false;
    updateStatus(sidebarToggle.checked);
  });
  
  sidebarToggle.addEventListener('change', function() {
    const isHidden = sidebarToggle.checked;
    chrome.storage.sync.set({sidebarHidden: isHidden});
    updateStatus(isHidden);
    
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "toggleSidebar", hidden: isHidden});
      }
    });
  });
  
  function updateStatus(sidebarHidden) {
    statusText.textContent = sidebarHidden ? "Status: Sidebar Hidden" : "Status: Sidebar Visible";
    statusText.style.color = sidebarHidden ? '#43b581' : '#b9bbbe';
  }
});