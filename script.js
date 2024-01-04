
document.querySelector('.busca').addEventListener('submit', async (event) => {
    event.preventDefault()

    let  input = document.querySelector('#searchInput').value

    if ( input !== '' ) {
        clearInfo()
        showWarning('Carregando...')

        let url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURI(input)}&appid=SEU_TOKEN&units=metric&lang=pt_br`

        let results = await fetch(url)

        let json = await results.json()

        if ( json.cod === 200 ) {
            showInfo({
                name: json.name,
                country: json.sys.country,
                temp: json.main.temp,
                tempIcon: json.weather[0].icon,
                windSpeed: json.wind.speed,
                windAngle: json.wind.deg,
            })
        } else {
            clearInfo()
            showWarning('Cidade não encontrada.')
        }
    } else {
        clearInfo()
    }
})

function showInfo(json) {
    showWarning('')

    Cidade(json.name).then((sigla) => {
        if (sigla !== '') {
            document.querySelector('.titulo').innerHTML = `${json.name} - ${sigla}/${json.country}`
        } else {
            document.querySelector('.titulo').innerHTML = `${json.name} - ${json.country}`
        }
    })

    document.querySelector('.tempInfo').innerHTML = `${json.temp}<sup>ºC</sup>`

    document.querySelector('.ventoInfo').innerHTML = `${json.windSpeed} <span>km/h<span>`

    document.querySelector('.temp img').setAttribute('src', `https://openweathermap.org/img/wn/${json.tempIcon}.png`)

    document.querySelector('.ventoPonto').style.transform = `rotate(${json.windAngle-90}deg)` 

    document.querySelector('.resultado').style.display = 'block'

}

function clearInfo() {
    showWarning('')
    document.querySelector('.resultado').style.display = 'none'
}

function showWarning(msg) {
    document.querySelector('.aviso').innerHTML = msg
}

async function Cidade(nome) {
    let url = `https://servicodados.ibge.gov.br/api/v1/localidades/distritos`
    let results = await fetch(url)
    let json = await results.json()
    let sigla = ''

    json.forEach((cidade) => {
        if (cidade.nome === nome) {
            sigla = cidade.municipio.microrregiao.mesorregiao.UF.sigla            
        }
    })

    return sigla
}

