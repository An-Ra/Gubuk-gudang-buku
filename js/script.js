const arrayBook = [];
const RENDER_EVENT = 'render-buku';
const SAVED_EVENT = 'saved-buku';
const STORAGE_KEY = "gudangBuku";

document.addEventListener("DOMContentLoaded",function(){
  const submitForm = document.getElementById('inputBook');
  submitForm.addEventListener('submit',function(event){
    event.preventDefault();
    addBook();
    
  })
  const searchForm = document.getElementById('searchBook');
  searchForm.addEventListener('submit',function(event){
    event.preventDefault();
    pencarianBuku();
  })
  if (isStorageExist()) {
    loadDataFromStorage();
  }
})
document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});
document.addEventListener(RENDER_EVENT,function(){
  console.log(arrayBook);
  const incompleteBookshelfList = document.getElementById('incompleteBookshelfList')
  incompleteBookshelfList.innerHTML = '';
  
  const completeBookshelfList = document.getElementById('completeBookshelfList')
  completeBookshelfList.innerHTML = '';
  
  for (const itemBuku of arrayBook) {
    const elementBuku = makeCard(itemBuku);

    if (!itemBuku.isCompleted){
    incompleteBookshelfList.append(elementBuku);
 
     } else {
    completeBookshelfList.append(elementBuku);
    
  }
  }
})


function isStorageExist(){
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

function addBook() {
  const judulBuku = document.getElementById('inputBookTitle').value;
  const pengarangBuku = document.getElementById('inputBookAuthor').value;
  const tahunBuku = parseInt(document.getElementById('inputBookYear').value);
  const isCompleted = document.getElementById('inputBookIsComplete').checked;
  
  const generatedID = generateId();
  const bukuObject = generateBukuObject(generatedID,judulBuku,pengarangBuku,tahunBuku,isCompleted)
  arrayBook.push(bukuObject);

  document.dispatchEvent(new Event(RENDER_EVENT))
  saveData();
}

function generateId() {
  return  +new Date();
}

function generateBukuObject(id,judul,pengarang,tahun,isCompleted) {
  return {
    id,
    judul,
    pengarang,
    tahun,
    isCompleted
  }}
  
  function makeCard(bukuObject) {
    
  const judulBuku = document.createElement('h3')
  judulBuku.innerText = bukuObject.judul;
  
  const pengarangBuku = document.createElement('p')
  pengarangBuku.innerText =`Penulis : ${bukuObject.pengarang}`;
  
  const tahunBuku = document.createElement('p')
  tahunBuku.innerText =`Tahun : ${bukuObject.tahun}`;
  
  const div = document.createElement('div')
  div.setAttribute('class','action')
  
  if(bukuObject.isCompleted) {
    
    const buttonUndo = document.createElement('button')
    buttonUndo.classList.add('green')
    buttonUndo.innerText = `Belum Selesai`;
    
    buttonUndo.addEventListener('click',function(){
      undoBookFromCompleted(bukuObject.id);
    })
    
    
    const buttonDelete = document.createElement('button')
    buttonDelete.classList.add('red')
    buttonDelete.innerText = `Hapus Buku`;
    
    buttonDelete.addEventListener('click',function(){
      deleteBookFromCompleted(bukuObject.id);
    })

    div.append(buttonUndo,buttonDelete)
    
  } else {
    
    const buttonComplete = document.createElement('button')
    buttonComplete.classList.add('green')
    buttonComplete.innerText = `Sudah Selesai`;

    buttonComplete.addEventListener('click',function(){
      addBookToCompleted(bukuObject.id);
    })
    
    div.append(buttonComplete)
    
  }
  
  
  const article = document.createElement('article')
  article.setAttribute('class','book_item')
  article.setAttribute('id',bukuObject.id)
  article.append(judulBuku,pengarangBuku,tahunBuku,div)

  return article

}

function addBookToCompleted(idBuku) {
  const targetBuku = cariBuku(idBuku);
  if (targetBuku == null) return;
  targetBuku.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT))
  saveData();
}

function cariBuku(idBuku) {
  for(const daftarBuku of arrayBook) {
    if(daftarBuku.id === idBuku) {
      return daftarBuku;
    }
  }
  return null
}

function deleteBookFromCompleted(idBuku) {
  const targetBuku = cariIndexBuku(idBuku);
  
  if(targetBuku === -1) return;
  arrayBook.splice(targetBuku,1)
  document.dispatchEvent(new Event(RENDER_EVENT))
  saveData();
}

function undoBookFromCompleted(idBuku) {
  const targetBuku = cariBuku(idBuku);
  
  if (targetBuku == null) return;
  
  targetBuku.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function cariIndexBuku(idBuku){
  for(const index in arrayBook) {
    if(arrayBook[index].id === idBuku) {
      return index
    }
  }
  return -1;
}

function pencarianBuku() {
  let input = document.getElementById('searchBookTitle').value
  input=input.toLowerCase();
  
  const incompleteBookshelfList = document.getElementById('incompleteBookshelfList')
  incompleteBookshelfList.innerHTML = '';
  
  const completeBookshelfList = document.getElementById('completeBookshelfList')
  completeBookshelfList.innerHTML = '';
  
  for (const itemBuku of arrayBook) {
    const elementBuku = makeCard(itemBuku);
    if(itemBuku.judul.toLowerCase().match(input)) {
      if (!itemBuku.isCompleted){
        incompleteBookshelfList.append(elementBuku);
        
      } else {
        completeBookshelfList.append(elementBuku);
        
      }
    }
  }
}
function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(arrayBook);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
  
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);
 
  if (data !== null) {
    for (const buku of data) {
      arrayBook.push(buku);
    }
  }
 
  document.dispatchEvent(new Event(RENDER_EVENT));
}
