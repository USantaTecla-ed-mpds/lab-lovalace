//alberto
const { Console } = require("console-mpds");
const console = new Console();
//comienzan: invierno el 21/12; primavera el 21/3; verano el 21/6; otoño el 21/9
const dMonth= 30;
const mntYear= 12;
const dWinter= 11*dMonth+21;
const dSpring= 2*dMonth +21;
const dSumer= 5*dMonth+21;
const dAutumn= 8*dMonth+21;


do{
    day = console.readNumber('Dame el día (1-30): ');
}while(day<=0||day>dMonth)

do{
    month = console.readNumber('Dame el més (1-12): ');
}while(month<=0||month>mntYear)

do{
    year = console.readNumber('Dame el año (1-...): ');
}while(year<0)

let msg = `El día ${day} del ${month} de ${year} cae a`;
let season;
let part;
const dayDate= (month-1)*dMonth+day;
let begin; 

if(dayDate<dSpring){
    season =` Invierno.`;
    begin=-9;// el 30 es el 0, 30-21 porque el invierno empieza 9 dias antes de cambiar de año
}else if (dayDate<dSumer){
    season =` Primavera.`;
    begin=dSpring;
}else if (dayDate<dAutumn){
    season =` Verano.`;
    begin=dSumer;
}else if (dayDate<dWinter){
    season =` Otoño.`;
    begin =dAutumn;
}else if (dayDate>=dWinter){
    season =` Invierno.`;
    part=` primeros de`;
}

if(!part){

    if(dayDate < begin+dMonth){
        part = ` primeros de`;
    }else if (dayDate<begin+2*dMonth){
        part = ` mediados de`;
    }else if (dayDate<begin+3*dMonth){
        part =` finales de`;
    }
}

console.writeln(msg+part+season);
