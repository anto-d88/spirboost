
const hidenid = document.getElementById('hidenid').innerHTML;
const userId = hidenid ;
document.getElementById("hidenid").style.display = "none"

document.addEventListener('DOMContentLoaded', () => {

    const userLinkspiruline = document.getElementById('spirulineBio');
    userLinkspiruline.href = `/spirulineBio?userId=${encodeURIComponent(userId)}`;
    const userLinkhistoirespiruline = document.getElementById('histoiredelaspiruline');
    userLinkhistoirespiruline.href = `/histoiredelaspiruline?userId=${encodeURIComponent(userId)}`;
    const userLinkcontact = document.getElementById('contact');
    userLinkcontact.href = `/contact?userId=${encodeURIComponent(userId)}`;


  });