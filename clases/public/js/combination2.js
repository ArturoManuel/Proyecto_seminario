
const SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
const SpeechGrammarList = window.SpeechGrammarList || webkitSpeechGrammarList;
const SpeechRecognitionEvent = window.SpeechRecognitionEvent || webkitSpeechRecognitionEvent;
const synth = window.speechSynthesis;
let  numero_preguntas=0;
let voices = [];
window.voices = voices
function populateVoiceList() {
    voices = synth.getVoices();
}
populateVoiceList();
let pregunta = ["¿Te gusta el anime", "¿Te gusta el color azul?","¿Haz visto la major?","¿Te gustan las películas?"];
const recognition = new SpeechRecognition();
recognition.continuous = false;
recognition.lang = 'es-ES';
recognition.interimResults = false;
recognition.maxAlternatives = 1;
const outputDiv = document.getElementById('output');
let  hablar=document.getElementById("hablar");

let estado="preguntando_nombre";
let nombre="";
let respuestas_positivas=["si","sí","claro","por supuesto","posiblemente","me gusta mucho","me ecanta","si me gusta","sí me gusta","me gusta","sí sí me gusta"];
let respuestas_negativas=["no","ni loco","Nunca","negativo","imposible","no lo entiendo","no me gusta"];
let comentario_positivo = ["genial","excelente","a mi también","Que onda wey","¡Fantástico!","¡Estupendo!"];
let comentario_negativo = ["oh, que pena","ni modo", "es una lástima","¿Cómo es posible?","entiendo"];
let empezar_reconition =()=>{
  recognition.start();
}
hablar.onclick = () => {
    populateVoiceList();
    hablar.disabled=true;
    hacer_hablar("Hola mi nombre es Agente 1 ¿Cuál es  tu nombre?",empezar_reconition)
    console.log('Ready to receive a color command.');
};

recognition.onresult = (event) => {
    let comando_recibido = event.results[0][0].transcript;
    console.log(comando_recibido);
  switch(estado){
    case "preguntando_nombre":
      let palabra = comando_recibido.split(' ');
      let nombre= palabra[palabra.length - 1];
      hacer_hablar("Hola"+nombre+"¿Te gusta el curso de Human Interactions?",empezar_reconition);
      estado="hacer_pregunta";
      break;
    case "hacer_pregunta":
      comando_recibido=comando_recibido.toLowerCase();
      console.log(comando_recibido);
      console.log("acá");
      let positivo = respuestas_positivas.map((valor)=>comando_recibido.includes(valor));
      let negativo = respuestas_negativas.map((valor)=>comando_recibido.includes(valor));
      console.log(negativo);
      let resultado_positivo = false;
      let resultado_negativo = false;
      positivo.map((valor)=>resultado_positivo=resultado_positivo  || valor);
      negativo.map((valor)=>resultado_negativo=resultado_negativo  || valor);
      let pregunta_actual = pregunta[numero_preguntas];
      console.log(resultado_positivo);
      console.log(resultado_negativo);
      if(resultado_negativo)
      setTimeout(()=>{
        let comentario = comentario_negativo[Math.floor(Math.random()*comentario_negativo.length)]
        hacer_hablar(comentario,()=>hacer_hablar(pregunta_actual,empezar_reconition))
      },2000);
      if(resultado_positivo)
      setTimeout(()=>{
        let comentario = comentario_positivo[Math.floor(Math.random()*comentario_positivo.length)]
          hacer_hablar(comentario,()=>hacer_hablar(pregunta_actual,empezar_reconition));
        },2000);
      
      numero_preguntas++;
      break;
    default:
      console.log("No estado");
      break;
  }
  }
  recognition.onspeechend = () => {
    console.log("Se detiene");
    recognition.stop();
  }

function hacer_hablar(voz,callback){
    const utterThis = new SpeechSynthesisUtterance(voz);
    outputDiv.innerHTML = 'Este es el mensaje:' +voz;
    for (const voice of voices) {
      if (voice.name === "Google español") {
        utterThis.voice = voice;
      }
  }
  utterThis.pitch = 1.0;
  utterThis.rate = 1.0;
  synth.speak(utterThis);
  utterThis.onend=()=>{callback()};
}
