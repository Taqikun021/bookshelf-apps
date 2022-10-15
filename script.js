const books = []
const RENDER_EVENT = 'render-bookshelf'
const SAVED_EVENT = 'save-books'
const STORAGE_KEY = 'BOOKSHELF_APPS'
const SEARCH_EVENT = 'search-books'

document.addEventListener('DOMContentLoaded', function () {
    const formTambah = document.getElementById('inputBook')
    formTambah.addEventListener('submit', function (event) {
        event.preventDefault()
        tambahBuku()
    })

    const formCari = document.getElementById('searchBook')
    formCari.addEventListener('submit', function (event) {
        event.preventDefault()
        cariBuku()
    })

    if (isStorageExist()) {
        getDataBuku()
    }
})

document.addEventListener(RENDER_EVENT, function () {
    const belumSelesai = document.getElementById('incompleteBookshelfList')
    belumSelesai.innerHTML = ''

    const selesai = document.getElementById('completeBookshelfList')
    selesai.innerHTML = ''

    for (const item of books) {
        const element = buatList(item)
        if (!item.isComplete) belumSelesai.append(element)
        else selesai.append(element)
    }
})

document.addEventListener(SEARCH_EVENT, function () {
    const title = document.getElementById('searchBookTitle').value
    const searchedBookList = document.getElementById('searchedBookList')
    searchedBookList.innerHTML = ''

    const list = books.filter(book => book.title.includes(title))
    console.log(list)
    for (const item of list) {
        const element = filteredList(item)
        searchedBookList.append(element)
    }
})

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Browser tidak mendukung fitur localStorage')
        return false
    }
    return true;
}

function simpanData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books)
        localStorage.setItem(STORAGE_KEY, parsed)
        document.dispatchEvent(new Event(SAVED_EVENT))
    }
}

function buatList(object) {
    const statusButton = document.createElement('button')
    statusButton.classList.add('green')
    if (object.isComplete) statusButton.innerText = 'Belum selesai dibaca'
    else statusButton.innerText = 'Selesai Dibaca'

    const hapusButton = document.createElement('button')
    hapusButton.innerText = 'Hapus Buku'
    hapusButton.classList.add('red')

    const buttonContainer = document.createElement('div')
    buttonContainer.classList.add('action')
    buttonContainer.append(statusButton, hapusButton)

    const title = document.createElement('h3')
    title.innerText = object.title

    const author = document.createElement('p')
    author.innerText = `Penulis: ${object.author}`

    const year = document.createElement('p')
    year.innerText = `Tahun: ${object.year}`

    const container = document.createElement('article')
    container.classList.add('book_item')
    container.append(title, author, year, buttonContainer)
    container.setAttribute('id', `book-${object.id}`)

    statusButton.addEventListener('click', function () {
        ubahStatusBuku(object.id)
    })

    hapusButton.addEventListener('click', function () {
        hapusBuku(object.id)
    })

    return container
}

function filteredList(object) {
    const title = document.createElement('h3')
    title.innerText = object.title

    const author = document.createElement('p')
    author.innerText = `Penulis: ${object.author}`

    const year = document.createElement('p')
    year.innerText = `Tahun: ${object.year}`

    const status = document.createElement('p')
    if (object.isComplete) status.innerText = 'Status: Selesai dibaca'
    else status.innerText = 'Status: Belum selesai Dibaca'

    const container = document.createElement('article')
    container.classList.add('book_item')
    container.append(title, author, year, status)
    container.setAttribute('id', `book-${object.id}`)

    return container
}

function getDataBuku() {
    const dataJSON = localStorage.getItem(STORAGE_KEY)
    const data = JSON.parse(dataJSON)

    if (data !== null) {
        for (const item of data) books.push(item)
    }

    document.dispatchEvent(new Event(RENDER_EVENT))
}

function generateID() {
    return +new Date();
}

function tambahBuku() {
    const id = generateID()
    const title = document.getElementById('inputBookTitle').value
    const author = document.getElementById('inputBookAuthor').value
    const year = document.getElementById('inputBookYear').value
    const isComplete = document.getElementById('inputBookIsComplete').checked

    const object = {id, title, author, year, isComplete}
    books.push(object)

    document.dispatchEvent(new Event(RENDER_EVENT))
    simpanData()
}

function cariBuku() {
    document.dispatchEvent(new Event(SEARCH_EVENT))
}

function findBook(id) {
    for (const item of books) if (item.id === id) return item
    return null;
}

function findBookIndex(id) {
    for (const index in books) if (books[index].id === id) return index
    return -1
}

function ubahStatusBuku(id) {
    const target = findBook(id)

    if (target == null) return;

    target.isComplete = !target.isComplete
    document.dispatchEvent(new Event(RENDER_EVENT))
    simpanData()
}

function hapusBuku(id) {
    const target = findBookIndex(id)

    if (target === -1) return;

    let konfirmasi = confirm(`Kamu akan menghapus buku ${books[target].title}. Yakin?`)
    if (konfirmasi === true) books.splice(target, 1)
    document.dispatchEvent(new Event(RENDER_EVENT))
    simpanData()
}