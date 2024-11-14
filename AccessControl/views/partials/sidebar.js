document.getElementById("sidebarToggle").addEventListener("click", function () {
  const sidebar = document.getElementById("sidebar");
  const content = document.getElementById("content");

  // Verifica se a sidebar está colapsada
  if (sidebar.style.width === "60px") {
    // Expande a sidebar
    sidebar.style.width = "250px";
    content.style.marginLeft = "250px";
  } else {
    // Recolhe a sidebar
    sidebar.style.width = "60px";
    content.style.marginLeft = "60px";
  }
});
