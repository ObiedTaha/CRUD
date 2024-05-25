var usersData = []
var realTimeData;
var updateLocation = 0;
var pageTarget = 1;
var validation = {
    name: /^[a-zA-Z _]{3,20}$/,
    category: /^[a-zA-Z _]{3,20}$/,
    price: /^[1-9][0-9]{0,5}$/,
    description: /^([a-zA-Z -(),.]{1,50})?$/
}
var alert = document.querySelectorAll(".form-alert")
var inputs = document.querySelectorAll(".form-container input")
var addBtn = document.getElementById("addBtn");
// 
(function RestorDataFromLocalStorge() {
    if (localStorage.getItem("users") != null) {
        usersData = JSON.parse(localStorage.getItem("users"))
        display()
        callpagination();
    }
})();
//for form floating action i use blur and focus
(function intialFocusBlurEvent() {
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].setAttribute("onfocus", `Focus(${i})`)
        inputs[i].setAttribute("onblur", `Blur(${i})`)
    }
})();
function Focus(index) {
    inputs[index].classList.add("input-focus")
    inputs[index].nextElementSibling.classList.add("label-focus")
}
function Blur(index) {
    if (!inputs[index].value) {
        inputs[index].classList.remove("input-focus")
        inputs[index].nextElementSibling.classList.remove("label-focus")
    }
}
// validation function,event and action
(function realTimeValidation() {
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener('keyup', function (e) {
            if (validation[`${e.target.name}`].test(e.target.value)) {
                e.target.nextElementSibling.classList.remove("label-invalid")
            }
            else {
                e.target.nextElementSibling.classList.add("label-invalid")
            }
        })
    }
})()
function validationPassTesting() {
    condation = true
    for (var i = 0; i < inputs.length; i++) {
        if (!validation[`${inputs[i].name}`].test(inputs[i].value)) {
            alert[i].classList.add("d-block")
            if (!inputs[i].value) {
                alert[i].innerHTML = "Requried"
            }
            document.querySelector(".check-false").classList.add("d-block")
            document.querySelector(".check-true").classList.remove("d-block")
            condation = false
        }
    }
    return condation
}
function clearAlert() {
    for (var i = 0; i < inputs.length; i++) {
        alert[i].classList.remove("d-block")
    }
}
// get data,display,set to update and delete 
function getData() {
    if (validationPassTesting()) {
        user = {
            name: inputs[0].value,
            category: inputs[1].value,
            price: inputs[2].value,
            description: inputs[3].value
        }
        usersData.push(user)
        realTimeData = usersData
        localStorage.setItem("users", JSON.stringify(usersData))
        clearAlert()
        resetForm()
        document.querySelector(".check-true").classList.add("d-block");
        document.querySelector(".check-false").classList.remove("d-block");
    }
}
function display(index) {
    var cartona = "";
    if (!realTimeData) { realTimeData = usersData }
    for (var i = (pageTarget - 1) * 5; i < (pageTarget * 5); i++) { //to loop for just 5 member
        if (i % 2 != 0) { rowColor = "bg-lightgary"; } else { rowColor = "bg-white"; } //to color the bg for each cell
        if (i < realTimeData.length) { // for last pagination if not contain 5 member to avoid error
            console.log(pageTarget)
            console.log(realTimeData.length)
            if (pageTarget == 0 && realTimeData.length == 0) {
                cartona = ""
            } else {
                cartona += `
            <div class="row ">
                <div class="col-1 ${rowColor}">${i + 1}</div>
                <div class="col-2 ${rowColor}">${realTimeData[i].name}</div>
                <div class="col-2 ${rowColor}">${realTimeData[i].category} </div>
                <div class="col-2 price-width ${rowColor}">${realTimeData[i].price}</div>
                <div class="col-4  ${rowColor}"><p>${realTimeData[i].description}</p></div>
                <div class="col-1  ${rowColor} d-flex flex-column  flex-md-row justify-content-md-around ">
                    <a href="#sameid" class='updatebtn' onclick='display(${i})'><i class="far fa-edit d"></i> </a>
                    <button class='delbtn' onclick='deleteProduct(${i})'><i class="fas fa-times"></i> </button>
                </div>
            </div>`
                if (index == i) { cartona += setDataToUpdate(i) } //for display data in update row after the selected element
            }
        }
    }
    document.getElementById("tableBody").innerHTML = cartona;
}
function setDataToUpdate(index) {
    var container = '';
    container += `<div class="row">
                <div class="col-md-1" id="sameid">${index + 1}</div>
                <div class="col-md-2 d-flex">
                <label for="newname" class="updatelabel d-md-none">Name</label>
                <input type="text" name="name" class="w-100 updatefield" value="${usersData[index].name}">
                </div>
                <div class="col-md-2 d-flex">
                <label class="updatelabel d-md-none">Category</label>
                <input type="text" name="category" class="w-100 updatefield" value="${usersData[index].category}">
                </div>
                <div class="col-md-2 d-flex">
                <label class="updatelabel d-md-none">Price</label>
                <input type="text" name="price" class="w-100 updatefield" value="${usersData[index].price}">
                </div>
                <div class="col-md-3 d-flex">
                <label class="updatelabel d-md-none">Description</label>
                <input type="text" name="description" class="w-100 updatefield" value="${usersData[index].description}">
                </div>
                <div class="col-md-2 d-flex px-0">
                <button id="save" type="button" class="savebtn" onclick="updateProduct(${index})">Save</button>
                <button id="cansal" type="button" class="cansalbtn" onclick="display()">Cancel</button>  
                </div>
                </div>`
    return container;
}
function deleteProduct(index) {
    let Confirm = confirm("are you sure to delete")
    if (Confirm == true) {
    }
    usersData.splice(index, 1)
    if (realTimeData.length % 5 == 0) {
        pageTarget = realTimeData.length / 5;
    }
    if (realTimeData.length == 0) {
        hideShowBtn.innerHTML = "Hide Record"
        hideShow()
    }
    realTimeData = usersData
    localStorage.setItem("users", JSON.stringify(usersData))
    display()
    callpagination()

}
function updateProduct(index) {
    var updateInput = document.querySelectorAll(".updatefield")
    condation = true
    for (var i = 0; i < updateInput.length; i++) {
        if (!validation[`${updateInput[i].name}`].test(updateInput[i].value)) {
            updateInput[i].classList.add("update-alert");
            condation = false
        } else {
            updateInput[i].classList.remove("update-alert");
        }
    }
    if (condation) {
        user = {
            name: updateInput[0].value,
            category: updateInput[1].value,
            price: updateInput[2].value,
            description: updateInput[3].value
        }
        usersData[index] = user
        realTimeData = usersData
        localStorage.setItem("users", JSON.stringify(usersData))
        display()
    }
}
function resetForm() {
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].value = "";
        Blur(i)
    }
}
addBtn.onclick = function () {
    getData()
    display()
    callpagination()

}
// pagination show,creat event
function showHidePagination() {
    var pageNo = realTimeData.length / 5;
    if (Math.ceil(pageNo) >= 2) {
        document.querySelector("#Page-pagination").classList.replace("d-none", "d-flex")
    }
    else {
        document.querySelector("#Page-pagination").classList.replace("d-flex", "d-none")
    }
}
function paginationList() {
    var pagination = document.querySelector(".pagination")
    var pageNo = realTimeData.length / 5;
    var cartona = "";
    for (var i = 0; i < pageNo; i++) {
        cartona += `<li"><button class="pagination-btn">${i + 1}</button></li>`
    }
    pagination.innerHTML =
        `${cartona}`
}
function declarePaginationListEvent() {
    var paginationItems = document.querySelectorAll(".pagination button")
    for (var i = 0; i < paginationItems.length; i++) {
        paginationItems[i].addEventListener("click", function (e) {
            pageTarget = e.target.innerHTML
            paginationItems.forEach(clearActive)
            e.target.classList.add("page-item-active")
            display()
        })
    }
}
function clearActive(value) {
    value.classList.remove("page-item-active")
}
function callpagination() {
    if (!realTimeData) {
        realTimeData = usersData
    }
    paginationList()
    declarePaginationListEvent()
    showHidePagination()
}
// hide and show record table 

hideShowBtn.onclick = hideShow
function hideShow() {
    var displayTable = document.querySelector("#table")
    if (hideShowBtn.innerHTML == "Hide Record") {
        displayTable.classList.add("d-none")
        hideShowBtn.innerHTML = "Show Record"
    }
    else {
        displayTable.classList.remove("d-none")
        hideShowBtn.innerHTML = "Hide Record"
    }
}
search.onkeyup = function () {
    realTimeData = []
    for (i = 0; i < usersData.length; i++) {
        if (usersData[i].name.toLowerCase().includes(search.value.toLowerCase())) {
            realTimeData.push(usersData[i])
        }
    }
    pageTarget = 1;
    display()
    callpagination()
}