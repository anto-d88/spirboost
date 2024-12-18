const hidenid = document.getElementById('hidenid').innerHTML;
const userId = hidenid ;

document.getElementById("hidenid").style.display = "none"

document.addEventListener('DOMContentLoaded', () => {

    const userLinkaccueil = document.getElementById('accueil');
    userLinkaccueil.href = `/accueil?userId=${encodeURIComponent(userId)}`;
    const userLinkpanier = document.getElementById('panier');
    userLinkpanier.href = `/panier?userId=${encodeURIComponent(userId)}`;
    const userLinkspiruline = document.getElementById('spirulineBio');
    userLinkspiruline.href = `/spirulineBio?userId=${encodeURIComponent(userId)}`;
    const userLinkEspaceClient = document.getElementById('espaceClient');
  userLinkEspaceClient.href = `/espaceClient?userId=${encodeURIComponent(userId)}`;
  const userLinkhistoirespiruline = document.getElementById('histoiredelaspiruline');
  userLinkhistoirespiruline.href = `/histoiredelaspiruline?userId=${encodeURIComponent(userId)}`;
  const userLinkcontact = document.getElementById('contact');
  userLinkcontact.href = `/contact?userId=${encodeURIComponent(userId)}`;

  
  });