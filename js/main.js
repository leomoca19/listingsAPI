/********************************************************************************
 * BTI425 – Assignment 2
 *
 * I declare that this assignment is my own work in accordance with Seneca's
 * Academic Integrity Policy:
 *
 * https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
 *
 * Name: Leonardo de la Mora Caceres Student ID: 152877205 Date: Jan-27-2025
 *
 ********************************************************************************/

// url parts
const domain = 'https://listings-api-eight.vercel.app'
const api = '/api/listings'

let page = 1,
  perPage = 10,
  searchName = null

function loadListingsData() {
  let url = domain + api + '?page=' + page + '&perPage=' + perPage

  if (searchName !== null) {
    url += `&name=${searchName}`
  }

  fetch(url)
    .then((res) => {
      return res.ok ? res.json() : Promise.reject(res.status)
    })
    .then((data) => {
      if (data.length) {
        displayListings(data)
      } else {
        if (page > 1) {
          prevPage()
        } else {
          noData()
        }
      }
    })
    .catch((err) => {
      console.log({ msg: 'no listings available', error: err })
    })
}

function noData() {
  document.getElementById('listingsTable').innerHTML =
    '<tr><td colspan="4">No data available</td></tr>'
}

function prevPage() {
  page--
  loadListingsData()
}

function nextPage() {
  page++
  loadListingsData()
}

function firstPage() {
  page = 1
  loadListingsData()
}

function displayListings(data) {
  toHtmlRows(data)
  document.getElementById('current-page').innerHTML = page

  document.querySelectorAll('#listingsTable tr').forEach((row) => {
    row.addEventListener('click', (e) => {
      fetch(domain + api + `/${row.getAttribute('data-id')}`)
        .then((res) => res.json())
        .then((data) => {
          document.querySelector('#detailsModal .modal-title').innerHTML =
            data.name
          document.querySelector('#detailsModal .modal-body').innerHTML =
            toHtmlModalBody(data)

          let modal = new bootstrap.Modal(
            document.getElementById('detailsModal'),
            {
              backdrop: 'static',
              keybaoard: false,
              focus: true,
            }
          )

          modal.show()
        })
    })
  })
}

function toHtmlRows(data) {
  const rows = data
    .map((listing) => {
      const summary = listing.summary || 'No summary available'

      return `<tr data-id="${listing._id}">
  <td>${listing.name}</td>
  <td>${listing.room_type}</td>
  <td>${listing.address.street}</td>
  <td>${summary}<br><br>
    <strong>Accommodates: </strong>${listing.accommodates}<br>
    <strong>Rating: </strong>${listing.review_scores.review_scores_rating} (${listing.number_of_reviews} Reviews)
  </td>
</tr>`
    })
    .join('')

  document.querySelector('#listingsTable tbody').innerHTML = rows
}

function toHtmlModalBody(data) {
  const overview = data.neighborhood_overview
    ? data.neighborhood_overview + '<br><br>'
    : '' // : 'No neighborhood overview available'

  return `<img id="photo" onerror="this.onerror=null;this.src = 'https://placehold.co/600x400?text=Photo+Not+Available'" class="img-fluid w-100" src="${
    data.images.picture_url
  }"><br><br>
${overview}
<strong>Price:</strong> ${data.price.toFixed(2)}<br>
<strong>Room:</strong> ${data.room_type}<br>
<strong>Bed:</strong> ${data.bed_type} (${data.beds})<br><br>`
}

document.addEventListener('DOMContentLoaded', (e) => {
  loadListingsData()

  document.getElementById('previous-page').addEventListener('click', (e) => {
    if (page > 1) {
      prevPage()
    }
  })

  document.getElementById('next-page').addEventListener('click', (e) => {
    nextPage()
  })

  document.getElementById('searchForm').addEventListener('submit', (e) => {
    e.preventDefault()
    searchName = document.getElementById('name').value
    firstPage()
  })

  document.getElementById('clearForm').addEventListener('click', (e) => {
    document.getElementById('name').value = ''
    searchName = null
    loadListingsData()
  })
})

console.log('main.js is connected!')
