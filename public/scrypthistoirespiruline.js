const hidenid = document.getElementById('hidenid').innerHTML;
const userId = hidenid ;

document.getElementById("hidenid").style.display = "none"
document.addEventListener('DOMContentLoaded', () => {
  const userLinkaccueil = document.getElementById('accueil');
  userLinkaccueil.href = `/accueil?userId=${encodeURIComponent(userId)}`;
  const userLinkspiruline = document.getElementById('spirulineBio');
  userLinkspiruline.href = `/spirulineBio?userId=${encodeURIComponent(userId)}`;
  const userLinkhistoirespiruline = document.getElementById('histoiredelaspiruline');
  userLinkhistoirespiruline.href = `/histoiredelaspiruline?userId=${encodeURIComponent(userId)}`;
  const userLinkpanier = document.getElementById('panier');
  userLinkpanier.href = `/panier?userId=${encodeURIComponent(userId)}`;
  const userLinkEspaceClient = document.getElementById('espaceClient');
  userLinkEspaceClient.href = `/espaceClient?userId=${encodeURIComponent(userId)}`;
  const userLinkcontact = document.getElementById('contact');
  userLinkcontact.href = `/contact?userId=${encodeURIComponent(userId)}`;
});
const slides = document.querySelector('.slider');
      const dots = document.querySelectorAll('.dot');
      let currentIndex = 0;
      const totalSlides = dots.length;
      let autoSlideInterval;

      // Function to update active slide and dot
      function updateSlide(index) {
          slides.style.transform = `translateX(-${index * 100}%)`;
          dots.forEach((dot, i) => {
              dot.classList.toggle('active', i === index);
          });
          currentIndex = index;
      }

      // Automatic slide show
      function startAutoSlide() {
          autoSlideInterval = setInterval(() => {
              let nextIndex = (currentIndex + 1) % totalSlides;
              updateSlide(nextIndex);
          }, 5000); // Change slide every 3 seconds
      }

      // Stop auto slide when user clicks a dot
      function stopAutoSlide() {
          clearInterval(autoSlideInterval);
      }

      // Add click event to dots
      dots.forEach((dot, index) => {
          dot.addEventListener('click', () => {
              stopAutoSlide();
              updateSlide(index);
              startAutoSlide(); // Restart auto slide after manual navigation
          });
      });

      // Start the slideshow
      updateSlide(currentIndex); // Initialize
      startAutoSlide();
