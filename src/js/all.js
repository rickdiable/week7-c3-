// data
let data = [];

let filterData = [];

// DOM
const form = document.querySelector(".addTicket-form");
const ticketName = document.querySelector('#ticketName');
const ticketImgUrl = document.querySelector('#ticketImgUrl');
const ticketRegion = document.querySelector('#ticketRegion');
const ticketPrice = document.querySelector('#ticketPrice');
const ticketNum = document.querySelector('#ticketNum');
const ticketRate = document.querySelector('#ticketRate');
const ticketDescription = document.querySelector('#ticketDescription');

const cardGroup = document.querySelector('.card-group');
const addBtn = document.querySelector('.addTicket-btn');
const searchResult = document.querySelector('.search-result');
const filterRegion = document.querySelector('#filterRegion');
const noData = document.querySelector('.no-data');

// AXIOS
axios.get('https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json')
  .then(function (response) {
    // handle success    
    data = response.data.data;
    // console.log(data);
    render(data);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })

  // 監聽
addBtn.addEventListener('click',() => {
  addTicket();
})
filterRegion.addEventListener('change',function(e){
  filter(e);
})

// function
function render(data){
  if(data.length == 0){
    noData.classList.remove('d-none');
  }else{
    noData.classList.add('d-none');
  }
  let str = "";
  let formatPrice = 0;
  searchResult.textContent = `本次搜尋共 ${data.length} 筆資料`;
  data.forEach((i) => {
    formatPrice = i.price.toLocaleString();
    str+=`
    <li class="card">
      <div class="por">
        <a href="#" class="card-img">              
          <img src="${i.imgUrl}" alt="行程圖片">
        </a>
        <div class="region">${i.area}</div>
        <div class="rank">${i.rate}</div>
      </div>
      <div class="card-content">
        <div>
          <h2 class="title"><a href="#">${i.name}</a></h2>
          <p class="content">${i.description}</p>
        </div>            
        <div class="status">
          <div class="d-flex ai-center">
            <i class="fas fa-exclamation-circle"></i>
            <p class="nums">剩下最後 ${i.group} 組</p>
          </div>
          <div class="d-flex ai-center">
            <p class="unit">TWD</p>
            <p class="price">$${formatPrice}</p>
          </div>
        </div>
      </div>
    </li>
    `
  })
  cardGroup.innerHTML = str;
  renderC3(data);
}

function addTicket(){
  let obj = {};
  if(ticketName.value == "" || ticketName.value == "" ||ticketRegion.value == "" || ticketPrice.value =="" || ticketNum.value =="" || ticketRate.value =="" || ticketDescription.value ==""){
    alert("所有欄位都必須填寫，請檢查後再次送出")
  }else if(ticketRate.value <0 || ticketRate.value >10){
    alert("星級區間為 1~10，請檢查後再次送出")
  }else{
    let formatPrice = parseInt(ticketPrice.value).toLocaleString();
    obj = {
      id: data.length,
      name: ticketName.value,
      imgUrl: ticketImgUrl.value,
      area: ticketRegion.value,
      description: ticketDescription.value,
      group: ticketNum.value,
      price: formatPrice,
      rate: ticketRate.value
    }
    data.push(obj);
    form.reset();
    filterRegion.value = "全部地區";
    // alert('成功新增資料!')
  }  
  render(data);
}

function filter(e){
  if(e.target.value == "全部地區"){
    render(data);
    return;
  }
  filterData = data.filter((i) => i.area == e.target.value);
  render(filterData);
  searchResult.textContent = `本次搜尋共 ${filterData.length} 筆資料`;
  renderC3(filterData);
}

function renderC3(data){
  let obj = {};
  data.forEach((i) => {
    if(obj[i.area] == undefined){
      obj[i.area] = 1;
    }else{
      obj[i.area] += 1;
    }
  })
  let dataArr = [];
  Object.keys(obj).forEach((i) => {
    dataArr.push([i, obj[i]]);
  })

  // render chart
  const chart = c3.generate({
    bindto: "#chart",
    size: {
      height: 160
    },  
    data: {
      columns: dataArr,
      type : 'donut',
      colors: {
        高雄: "#E68618",
        台中: "#5151D3",
        台北: "#26BFC7",
      },
    },
    donut: {
      title: "套票地區比重",
      width: 10
    },
  });
}