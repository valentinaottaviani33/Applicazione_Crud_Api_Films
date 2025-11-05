//faccio le operazioni crud  : create read update delete
//le richiamo come funzione ai bottoni dentro alla function di fetch associati al click

//create : aggiungo i valori e creo l oggetto in formato json con il metodo stringify con POST

//update : riprendo l oggetto con ...spreadOperators e gli passo i nuovi valori con PUT
//come riprendo i valori? passadoli e modificandoli


document.addEventListener('DOMContentLoaded', () => {

    //dobbiamo prendere l endpoint
    //const API_URL = 'http://localhost:3000/films';

   const API_URL = 'https://690a1fcc1a446bb9cc2172b1.mockapi.io/films/films'

    //attivare un API o l altra per deploy su Vercel 
    //const API_URL = 'https://6903a84dd0f10a340b253f8c.mockapi.io/films/:endpoint';
    //                 https://6903a84dd0f10a340b253f8c.mockapi.io/films/


    //prendere tutti gli id con il .getElementById() e salvarli in una costante 
    const newFilmInput = document.getElementById('new-film');
    const newDirectorInput = document.getElementById('new-director');
    const newRatingInput = document.getElementById('new-rating');
    const newDateInput = document.getElementById('new-date');
    const newTimeInput = document.getElementById('new-time');
    const filmList = document.getElementById('film-list');
    const addFilmBtn = document.getElementById('add-film');

    const newComment = document.getElementById('new-comment');

    let myChart = null;

    //prendo i dati per il modale di modifica

    const editModal = new bootstrap.Modal(document.getElementById('editModal'));
    const editForm = document.getElementById('editForm');
    
    //prendo i dati per il modale di eliminazione

    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

    //prendo l input del cerca film
    const searchFilmInput = document.getElementById('searchFilm');

    //prendo l inpu del seacrh per regista
    const searchRegistaInput = document.getElementById('searchRegista');

    let allFilms = []; // lista completa di film per il filtro


    //renderizza a chart a schermo 
    function renderChart(films){

        const ctx = document.getElementById('myChart');
        const labels = films.map(f => f.title);
        const data = films.map(f => Number(f.voto) || 0);


        if(!ctx) return;

        if(myChart){

            myChart.data.labels = labels;
            myChart.data.datasets[0].data = data;
            myChart.update();
        }else {

            myChart = new Chart(ctx, {
                                        type: 'line',
                                        data: {

                                            labels: labels,
                                            datasets: [{
                                                label: 'Voto',
                                                data: data,
                                                borderWidth: 3,
                                                backgroundColor: 'rgba(255, 193, 7, 0.5)',
                                                borderColor: 'rgba(255, 193, 7, 1)'
                                            }]

                                        },
                                        options: {
                                            responsive: true,
                                            maintainAspectRatio: true,
                                            plugins: {
                                                legend: { display: false },
                                                title: { display: true, text: 'Voti per Film', color: '#ffc107', font: { size: 20,weight: 'bold'}},
                                                tooltip: {
                                                callbacks: {
                                                    label: (context) => `Voto: ${context.parsed.y}`
                                                }
                                                }
                                            },
                                            scales: {
                                                y: {
                                                beginAtZero: true,
                                                suggestedMax: 10,
                                                ticks: { stepSize: 1, color: '#ffc107', //valori asse Y gialli
                                                font: {
                                                    size: 14,
                                                    weight: 'bold'
                                                }
                                                },
                                                grid: {
                                                color: 'rgba(255, 255, 255, 0.1)' //linee griglia leggere
                                                }
                                            },
                                            x: {
                                                ticks: {
                                                color: '#ffffff', //nomi film bianchi
                                                font: {
                                                    size: 13
                                                }
                                                },
                                                grid: {
                                                display: false //niente linee verticali
                                                }
                                            }
                                            }
                                        }
                                        });
        }
    }


    //RECUPERO DATI CON IL FETCH dei dati
    function fetchFilms(){

        fetch(API_URL)
            .then(res => {

                if(!res.ok) throw new Error('ERRORE NEL RECUPERO DAEI DATI');
                return res.json(); // converto in formato json

            }).then(data => {

                allFilms = data; //salvo tutti i film
                //vado a richiamare la funzione che mostra gli elementi
                renderFilteredFilms(data)
            })

            .catch(err => console.error('Errore nel fetch dei dati : ', err));
    }


    //MOSTRO I DATI 
    function renderFilteredFilms(data){

                            //pulisco la lista la svuoto
                            filmList.innerHTML = '';

                            //se non ci sono dati, quindi la lunghezza dei dati è uguale a 0, 
                            //mostra un template literals che mostra un <p> di notifica
                            if (data.length === 0){

                                //template literals e questi : `` si chiamano "backtick"
                                filmList.innerHTML = `<p class="text-center text-muted mt-4" style="color: white;">Nessun film presente.</p>`;
                                return;

                            }

                            //ciclo su ogni film di data
                            data.forEach(film => {

                                const li = document.createElement('li');
                                li.classList.add(

                                    'film-card',
                                    'd-flex',
                                    'justify-content-between',
                                    'align-items-start',
                                    'flex-wrap'
                                );


                                //Formatto la data
                                //const formatDate = film.date ? new Date(film.date).toLocaleDateString('it-IT') : ''; 

                                

                                // INFO DEL FILM
                                const infoDiv = document.createElement('div');
                                infoDiv.innerHTML = `  <div class="film-title">
                                                            <i class="bi bi-camera-reels-fill text-warning"></i> 
                                                            ${film.title}
                                                        </div>
                                                    
                                                        ${film.comment}
                                                        <div class="film-details">
                                                        📽️<strong>Regista : </strong>${film.regista} &nbsp;|&nbsp;
                                                        ⭐<strong>Voto : </strong>${film.voto} &nbsp;|&nbsp;
                                                        📆<strong>Data : </strong>${film.date} &nbsp;|&nbsp;
                                                        🕗<strong>Orario : </strong>${film.time} &nbsp;|&nbsp;
                                                        </div>
                                                    `;



                                //SEZIONE BOTTONI DI CIASCUN FILM CREATI DINAMICAMENTE
                                const btnGroup = document.createElement('div');
                                btnGroup.classList.add('film-action', 'mt-2');

                                //EDIT BUTTON
                                const editBtn = document.createElement('button');
                                //associo classi bootstrap al button
                                editBtn.classList.add('btn', 'btn-warning', 'btn-sm', 'm-2');
                                //nome del bottone
                                editBtn.textContent = 'Modifica';
                                //icona bootstrap
                                editBtn.innerHTML = `<i class="bi bi-pencil"></i>`;
                                //passo a funzione di editFilm all evento click del bottone
                                editBtn.onclick = () => editFilm(film);

                                //DELETE BUTTON
                                const deleteBtn = document.createElement('div');
                                deleteBtn.classList.add('btn', 'btn-danger', 'btn-sm');
                                //nome del bottone
                                deleteBtn.textContent = 'Elimina';
                                //icona bootstrap
                                deleteBtn.innerHTML = `<i class="bi bi-trash"></i>`;
                                //passo a funzione di deleteFilm all evento click del bottone
                                deleteBtn.onclick = () => deleteFilm(film.id);


                                //Raggruppo i bottoni e unisco gli elementi
                                //appendo i due bottoni nel btngroup
                                btnGroup.append(editBtn, deleteBtn);
                                //appendo il gruppo di bottoni e il template dell infodiv nell <li>
                                //li.append(btnGroup, infoDiv);
                                //appendo le <li> nell <ul> filmList
                                //filmList.appendChild(li);




                                //Condizione ternaria che controlla SE ESISTE un commento
                                const commentoFilm = film.comment 
                                //se esiste, mi crea il template literals
                                ? `<i class="bi bi-chat-text-fill comment-icon" 
                                            title="Visualizza commento" 
                                            data-comment="${film.comment}">
                                    </i>`
                                //se non esiste non presenta l icona
                                : '';



                                //Struttura del contenuto del film !!!! è UN TEST DOMANI VEDIAMO ASSIEME !!!
                                li.innerHTML = `
                                <div class="film-info flex-grow-1">
                                    <div class="film-title fw-bold mb-1">
                                        <i class="bi bi-person-video3 text-warning"></i> 
                                        ${film.title}
                                        ${commentoFilm}
                                    </div>
                                    <div class="film-details small">
                                        🎬 <strong>Regista:</strong> ${film.regista} &nbsp;|&nbsp;
                                        ⭐ <strong>Voto:</strong> ${film.voto} &nbsp;|&nbsp;
                                        📅 <strong>Data:</strong> ${film.date} &nbsp;|&nbsp;
                                        ⏰ <strong>Orario:</strong> ${film.time} 
                                    </div>
                                </div>
                                `;

                            
                                li.appendChild(btnGroup);
                                filmList.appendChild(li);
                            });

                            //query selector class ed evento su tutte le icone

                            document.querySelectorAll('.comment-icon').forEach(icon => {

                                icon.addEventListener('click', () => {

                                    const commentText = icon.getAttribute('data-comment');
                                    document.getElementById('commentText').textContent = commentText;

                                    const commentModal = new bootstrap.Modal(document.getElementById('commentModal'));

                                    commentModal.show();
                                });
                            });
                            renderChart(data);
                                  
    }


    //Filtro di ricerca per il titolo
    function filteredFilms(searchTitle){

        const filtered = allFilms.filter(film => 
            
            film.title.toLowerCase().includes(searchTitle.toLowerCase())
        );


        renderFilteredFilms(filtered);

    }



    //Filtro di ricerca per il titolo
    function filteredFilms(searchRegista){

        const filtered = allFilms.filter(film => 
            
            film.regista.toLowerCase().includes(searchRegista.toLowerCase())
        );


        renderFilteredFilms(filtered);

    }


    //Evento di filtro listener per filtro regista

    searchRegistaInput.addEventListener('input', e => {

        const searchRegista = e.target.value.trim();
        filteredFilms(searchRegista);
    });


    //Evento di filtro listener per filtro Titolo

    searchFilmInput.addEventListener('input', e => {

        const searchTitle = e.target.value.trim();
        filteredFilms(searchTitle);
    });































    //funzione CREATE
    //al click del bottone, scatena un evento 
    addFilmBtn.addEventListener('click', () => {

        //creo la const per ogni input prendendo il valore e tolgo gli spazi con .trim()
        const title = newFilmInput.value.trim(); // valore titolo
        const regista = newDirectorInput.value.trim(); // valore regista
        const voto = newRatingInput.value.trim(); // voto
        const date = newDateInput.value.trim(); //data
        const time = newTimeInput.value.trim(); // orario
        const comment = newComment.value.trim(); // commento

        //se non ho il title OPPURE non ho il regista
        if(!title || !regista) {

            alert('Inserisci almeno un Titolo o un Regista!');
            return;

        }

        //Costruisco l oggetto Film:
        const nuovoFilm = { title, regista, voto, date, time, comment };

        //per inviare il nuovo oggetto creato 
        //con i dati presi in input devo eseguire il metodo POST!

        fetch(API_URL, {

            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(nuovoFilm),
        })
        .then(res => {

            if(!res.ok) throw new Error('Errore nella creazione del film!');

            //reset dei campi, svuoto il campo di inserimento
            newDateInput.value = '';
            newDirectorInput.value = '';
            newFilmInput.value = '';
            newRatingInput.value = '';
            newTimeInput.value = '';
            newComment.value = '';
            fetchFilms();
            //alert("Il tuo nuovo film è stato aggiunto alla lista!");
            //implementare l alert con un altro modale tipo quello di delete
        })

        .catch(err => console.log('Errore nel POST', err));
    });

    
    //funzione UPDATE / "EDIT"
   /* window.editFilm = function(film){

        const nuovoTitolo = prompt('Modifica il Titolo del Film : ', film.title );
        if (nuovoTitolo === null ) return; //annulla

        const nuovoRegista = prompt('Modifica il Regista : ', film.regista);
        if (nuovoRegista === null ) return; //annulla

        const nuovoVoto = prompt('Inserisci un nuovo voto : ', film.voto);
        if (nuovoVoto === null ) return; //annulla

        const nuovaData = prompt('Insierisci una nuova data : ', film.date);
        if ( nuovaData === null ) return; //annulla

        const nuovoOrario = prompt('Inserisci un nuovo orario  : ', film.time);
        if ( nuovoOrario === null ) return; //annulla


        //una volta ottenuti tutti i nuovi dati scritti dai vari prompt,
        //prendo l oggetto "attuale" preso grazie all ID univoco e passo i nuovi valori inseriti come valori del nuovo oggetto

        const filmAggiornato = {
            //prendo l ogetto attuale con spread operators
            ...film,
            //assegno nuovi valori all oggetto
            title: nuovoTitolo.trim(),
            regista: nuovoRegista.trim(),
            voto: nuovoVoto.trim(),
            date: nuovaData.trim(),
            time: nuovoOrario.trim(),
        };

        //Ora che ho IL NUOVO OGGETTO FILM(filmAggiornato), LO INVIO CON LA CHIAMATA FETCH con METODO PUT (modifica)

        fetch(`${API_URL}/${film.id}`, {

            method : 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(filmAggiornato),

        }).then(res => {

            if(!res.ok) throw new Error('Errore nell aggiornamento dei dati!');
            fetchFilms();


        })
        .catch(err => console.error('ERRORE NEL METODO PUT', err));
    };
    */


    //NUOVA FUNCTIONE DI EDIT, TEST PER MODALE
    window.editFilm = function(film){

        currentFilm = film;

        document.getElementById('editTitle').value = film.title;
        document.getElementById('editRegista').value = film.regista;
        document.getElementById('editVoto').value = film.voto;
        document.getElementById('editDate').value = film.date;
        document.getElementById('editTime').value = film.time;
        //document.getElementById('editComment').value = film.comment;

        editModal.show();

    };

    editForm.addEventListener('submit', () => {

        if(!currentFilm) return;

        //ci construiamo l oggetto

        const filmAggiornato = {

            ...currentFilm, //prendo l oggetto film

            //passo i nuovi valori per la costruzione del nuovo oggetto
            title: document.getElementById('editTitle').value.trim(),
            regista: document.getElementById('editRegista').value.trim(),
            voto: document.getElementById('editVoto').value.trim(),
            date: document.getElementById('editDate').value.trim(),
            time: document.getElementById('editTime').value.trim(),
            comment: document.getElementById('editComment').value.trim(),

        };

        fetch(`${API_URL}/${currentFilm.id}`, {

            method: 'PUT',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(filmAggiornato)
        }).then(res => {
            if(!res.ok) throw new Error('Errore aggiornamento');
            editModal.hide();
            fetchFilms();
        })

        .catch(err => console.error('Errore nel metodo PUT', err));
    });



    //funzione di DELETE
   /* window.deleteFilm = function(id){

        if(!confirm('Sei sicuro di voler cancellare questo film?')) return;

        fetch(`${API_URL}/${id}`,{

            method: 'DELETE',

        })
        .then(res => {

            if (!res.ok) throw new Error('Errore durante eliminazione');
            fetchFilms();
        })
        .catch(err => console.error('Errore nel metodo DELETE : ', err));

    };
    */


    //NUOVA FUNZIONE DI DELETE CON MODALE

    window.deleteFilm = function(id){

        deleteFilmId = id;

        fetch(`${API_URL}/${id}`)
            
            .then(res => res.json())

            .then(film => {

                deleteFilmTitle.textContent = film.title;
                deleteModal.show();
            })

    };


    confirmDeleteBtn.addEventListener('click', () => {
        if(!deleteFilmId) return;

        fetch(`${API_URL}/${deleteFilmId}`, {

            method: 'DELETE'

        }).then(res => {

            if(!res.ok) throw new Error('Errore eliminazione');
            deleteModal.hide();
            fetchFilms();
        })

        .catch(err => console.error('Errore nel metodo DELETE : ', err));

    });
    
    fetchFilms();
});
