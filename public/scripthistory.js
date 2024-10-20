document.getElementById('moreInfoBtn').addEventListener('click', function() {
    var moreInfoSection = document.getElementById('moreInfo');
    if (moreInfoSection.style.display === 'none') {
        moreInfoSection.style.display = 'block';
        this.textContent = 'Réduire';
    } else {
        moreInfoSection.style.display = 'none';
        this.textContent = 'En savoir plus';
    }
});
