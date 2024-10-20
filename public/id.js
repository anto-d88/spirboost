document.addEventListener('DOMContentLoaded', () => {
    const hidenid = document.getElementById('hidenid').innerHTML;
    const userId = hidenid ;
    const userLinkhistory = document.getElementById('history');
    userLinkhistory.href = `/history?userId=${encodeURIComponent(userId)}`;
    const userLinkproduis = document.getElementById('produis');
    userLinkproduis.href = `/produis?userId=${encodeURIComponent(userId)}`;
  });