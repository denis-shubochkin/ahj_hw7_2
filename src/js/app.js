const addBut = document.querySelector('.add-button');
const editForm = document.querySelector('.edit-form');
const closeEditForm = document.querySelector('.button-cancel');
const saveEditForm = document.querySelector('.button-save');
const name = document.querySelector('.input');
const desc = document.querySelector('.textarea');
const hiddenInput = document.querySelector('.hidden-input');
const ticketList = document.querySelector('.tickets-list-form');
const delForm = document.querySelector('.delete-confirm-form');
const confirmOk = document.querySelector('.delete-ok');
const deleteCancel = document.querySelector('.delete-cancel');
let allticketsList = document.querySelectorAll('ticket');
let editId = null;
let delId = null;
let tickets = [];
let editObj;


function getMaxId() {
  const arr = [];
  console.log(tickets);
  if (tickets.length >= 1) {
    tickets.forEach((element) => {
      arr.push(element.id);
    });
  } else {
    arr.push(0);
  }
  return Math.max.apply(null, arr) + 1;
}


function addTicket(ticket) {
  const newEl = document.createElement('div');
  newEl.classList.add('ticket');
  newEl.id = ticket.id;
  ticketList.appendChild(newEl);
  const mainInfo = document.createElement('div');
  mainInfo.classList.add('main-info');
  newEl.appendChild(mainInfo);
  let newElChild = document.createElement('div');
  newElChild.classList.add('list-element');
  newElChild.classList.add('status');
  newElChild.classList.add('button');
  mainInfo.appendChild(newElChild);
  newElChild = document.createElement('div');
  newElChild.classList.add('list-element');
  newElChild.classList.add('name');
  newElChild.textContent = ticket.name;
  mainInfo.appendChild(newElChild);
  newElChild = document.createElement('div');
  newElChild.classList.add('list-element');
  newElChild.classList.add('date');
  newElChild.textContent = ticket.created;
  mainInfo.appendChild(newElChild);
  newElChild = document.createElement('div');
  newElChild.classList.add('list-element');
  newElChild.classList.add('action');
  mainInfo.appendChild(newElChild);
  let newElChildButton = document.createElement('button');
  newElChildButton.classList.add('edit-button');
  newElChildButton.classList.add('button');
  newElChild.appendChild(newElChildButton);
  newElChildButton = document.createElement('button');
  newElChildButton.classList.add('delete-button');
  newElChildButton.classList.add('button');
  newElChild.appendChild(newElChildButton);
  const descriptionEl = document.createElement('div');
  descriptionEl.classList.add('desc');
  newEl.appendChild(descriptionEl);
}

function addDesc(data) {
  const cur = document.getElementById(data.id);
  const curDesc = cur.querySelector('.desc');
  curDesc.textContent = data.description;
  curDesc.style.display = 'block';
}


function getTicketbyId(id) {
  const params = new URLSearchParams();
  params.append('method', 'ticketById');
  params.append('id', id);
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `https://zippo1095-ahj-hw7-2.herokuapp.com:7070/?${params}`);
  xhr.send();
  xhr.addEventListener('load', () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        const data = JSON.parse(xhr.responseText);
        editObj = data;
        name.value = editObj.name;
        desc.value = editObj.description;
      } catch (e) {
        console.error(e);
      }
    }
  });
}

function getTicketDesc(id) {
  const params = new URLSearchParams();
  params.append('method', 'ticketById');
  params.append('id', id);
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `https://zippo1095-ahj-hw7-2.herokuapp.com:7070/?${params}`);
  xhr.send();
  xhr.addEventListener('load', () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        const data = JSON.parse(xhr.responseText);
        addDesc(data);
      } catch (e) {
        console.error(e);
      }
    }
  });
}


function openEditForm(openType, id) {
  if (delId === null) {
    if (openType === 'edit' && editForm.style.display === 'none') {
      getTicketbyId(id);
    }
    editForm.style.display = 'block';
  }
}

function openDesc(event) {
  if (event.target.classList.contains('button')) {
    return;
  }
  const elem = event.target.closest('.ticket').querySelector('.desc');
  if (elem.style.display === 'block') {
    elem.style.display = 'none';
  } else {
    const descId = event.target.closest('.ticket').id;
    getTicketDesc(descId);
  }
}

function refreshListeners() {
  allticketsList.forEach((el) => {
    el.removeEventListener('click', openDesc);
  });
  allticketsList = document.querySelectorAll('.main-info');
  allticketsList.forEach((el) => {
    el.addEventListener('click', openDesc);
  });
  const editButtons = document.querySelectorAll('.edit-button');
  editButtons.forEach((el) => {
    el.addEventListener('click', () => {
      editId = el.closest('.ticket').id;
      openEditForm('edit', editId);
    });
  });
  const delButtons = document.querySelectorAll('.delete-button');
  delButtons.forEach((el) => {
    el.addEventListener('click', (event) => {
      if (editId === null) {
        delId = event.target.closest('.ticket').id;
        delForm.style.display = 'block';
      }
    });
  });
}


function clearTickets() {
  const alltickets = document.querySelectorAll('.ticket');
  alltickets.forEach((el) => {
    el.remove();
  });
  tickets = [];
}


function getTickets() {
  const params = new URLSearchParams();
  params.append('method', 'allTickets');
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `https://zippo1095-ahj-hw7-2.herokuapp.com:7070/?${params}`);
  xhr.send();
  xhr.addEventListener('load', () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        const data = JSON.parse(xhr.responseText);
        tickets = data;
        if (tickets.length < 1) {
          console.log('Список тикетов пуст');
        } else {
          tickets.forEach((el) => {
            addTicket(el);
          });
          refreshListeners();
        }
      } catch (e) {
        console.error(e);
      }
    }
  });
}


function postTicket(p) {
  const now = new Date().toLocaleString();
  const params = new URLSearchParams();
  params.append('method', 'createTicket');
  params.append('id', getMaxId());
  params.append('name', p.name);
  params.append('status', p.status);
  params.append('description', p.description);
  params.append('created', now);
  const xhr = new XMLHttpRequest();
  xhr.open('POST', `https://zippo1095-ahj-hw7-2.herokuapp.com:7070/?${params}`);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.send(JSON.stringify(params));
  xhr.addEventListener('load', () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        // const data = JSON.parse(xhr.responseText);
        clearTickets();
        getTickets();
      } catch (e) {
        console.error(e);
      }
    }
  });
}


function patchTicket(p) {
  const params = new URLSearchParams();
  params.append('method', 'patchTicket');
  params.append('id', p.id);
  params.append('name', p.name);
  params.append('status', p.status);
  params.append('description', p.description);
  params.append('created', p.created);
  const xhr = new XMLHttpRequest();
  xhr.open('PATCH', `https://zippo1095-ahj-hw7-2.herokuapp.com:7070/?${params}`);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.send(JSON.stringify(params));
  xhr.addEventListener('load', () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        // const data = xhr.responseText;
        clearTickets();
        getTickets();
      } catch (e) {
        console.error(e);
      }
    }
  });
}


function delTicket(id) {
  const params = new URLSearchParams();
  params.append('method', 'delTicket');
  params.append('id', id);
  const xhr = new XMLHttpRequest();
  xhr.open('DELETE', `https://zippo1095-ahj-hw7-2.herokuapp.com:7070/?${params}`);
  xhr.send();
  xhr.addEventListener('load', () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        // const data = xhr.responseText;
        clearTickets();
        getTickets();
      } catch (e) {
        console.error(e);
      }
    }
  });
}


confirmOk.addEventListener('click', () => {
  delTicket(delId);
  delForm.style.display = 'none';
  delId = null;
});

deleteCancel.addEventListener('click', () => {
  delForm.style.display = 'none';
  delId = null;
});


function init() {
  getTickets();
}

init();


addBut.addEventListener('click', openEditForm);

closeEditForm.addEventListener('click', () => {
  name.value = '';
  desc.value = '';
  editForm.style.display = 'none';
  editId = null;
});

name.addEventListener('change', () => {
  hiddenInput.style.display = 'none';
});

saveEditForm.addEventListener('click', () => {
  if (name.value === '') {
    const { top, left } = name.getBoundingClientRect();
    hiddenInput.style.top = `${window.scrollY + name.offsetHeight + top}px`;
    hiddenInput.style.left = `${window.scrollX + left}px`;
    hiddenInput.style.display = 'block';
    return;
  }
  if (editId === null) {
    const obj = {};
    obj.name = name.value;
    obj.status = true;
    if (desc.value === '') {
      obj.description = 'Описание отсутствует';
    } else {
      obj.description = desc.value;
    }
    postTicket(obj);
    name.value = '';
    desc.value = '';
    editForm.style.display = 'none';
  } else {
    tickets = [];
    editObj.name = name.value;
    editObj.description = desc.value;
    patchTicket(editObj);
    name.value = '';
    desc.value = '';
    editForm.style.display = 'none';
    editId = null;
  }
});
