const edit = document.getElementById("edit");
const editprofile = document.getElementById("editpro");
function myFunction() {
  if (editprofile.style.display === "none") {
    editprofile.style.display = "block";
    // this.classList.remove("active");
  } else {
    editprofile.style.display = "none";
  }
}
// edit.addEventListener("click", function (err, event) {
//   if (editprofile.classList.contains("active")) {
//     editprofile.classList.remove("active");
//     editprofile.classList.add("hidden");
//     // this.classList.remove("active");
//   } else {
//     editprofile.classList.remove("hidden");
//     editprofile.innerHTML

//     editprofile.classList.add("active");
//   }
// });
