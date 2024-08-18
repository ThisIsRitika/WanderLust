//bootstrap valiadation
(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
})()

// tax switch functionality
let taxSwitch= document.getElementById("flexSwitchCheckDefault");
    taxSwitch.addEventListener("click",()=>{
        let originalPrices = document.getElementsByClassName("original-price");
        let taxInfos=document.getElementsByClassName("tax-info");

        for (let i = 0; i < originalPrices.length; i++) {
          if (originalPrices[i].style.display === "none") {
              originalPrices[i].style.display = "inline";
              taxInfos[i].style.display = "none";
          } else {
              originalPrices[i].style.display = "none";
              taxInfos[i].style.display = "inline";
          }
      }
  });

// scroll buttons functionality
document.addEventListener('DOMContentLoaded', function () {
  const scrollLeftBtn = document.getElementById('scroll-left');
  const scrollRightBtn = document.getElementById('scroll-right');
  const scrollContent = document.querySelector('.scroll-content');

  function updateButtons() {
      const scrollLeft = scrollContent.scrollLeft === 0;
      const scrollRight = scrollContent.scrollWidth - scrollContent.scrollLeft === scrollContent.clientWidth;

      scrollLeftBtn.style.display = scrollLeft ? 'none' : 'block';
      scrollRightBtn.style.display = scrollRight ? 'none' : 'block';
  }

  // Scroll left
  scrollLeftBtn.addEventListener('click', function () {
      scrollContent.scrollBy({ left: -100, behavior: 'smooth' });
      updateButtons();
  });

  // Scroll right
  scrollRightBtn.addEventListener('click', function () {
      scrollContent.scrollBy({ left: 100, behavior: 'smooth' });
      updateButtons();
  });

  // Initialize button visibility and scroll event listener
  scrollContent.addEventListener('scroll', updateButtons);
  updateButtons();
});


