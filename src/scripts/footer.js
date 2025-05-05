document.querySelector("#footer").innerHTML = `
<footer class="footer sm:footer-horizontal footer-center bg-base-300 text-base-content p-4 w-full mt-auto">
  <aside>
    <p>Copyright © ${new Date().getFullYear()} - All right reserved by Tiago</p>
  </aside>
</footer>`

// Ajout des styles pour fixer le footer au bas de la page
document.addEventListener('DOMContentLoaded', function() {
  document.body.classList.add('min-h-screen', 'flex', 'flex-col');
  
  const appElement = document.getElementById('app');
  if (appElement) {
    appElement.classList.add('flex', 'flex-col', 'min-h-screen');
  }
  
  const mainElement = document.getElementById('main');
  if (mainElement) {
    mainElement.classList.add('flex-grow');
  }
});