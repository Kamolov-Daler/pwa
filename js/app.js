window.addEventListener("load", async () => {
  if ("serviceWorker" in navigator) {
    try {
      const reg = await navigator.serviceWorker.register("/sw.js");
      console.log("Service worker register success", reg);
    } catch (e) {
      console.log("Service worker register fail");
    }
  }
  await getUser();
});

async function getUser() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    const responseJson = await response.json();

    document.querySelector('.container').innerHTML = JSON.stringify(responseJson);
    return responseJson;
  } catch (e) {
    console.log(e);
    return e;
  }
}
