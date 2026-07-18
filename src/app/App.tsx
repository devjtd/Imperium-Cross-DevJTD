import { useState, useRef, useEffect } from "react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { chatWithCoach } from "@/services/groqChat";
import logoImg from "@/imports/Logo.png";
import chestPressImg from "@/imports/chest-press-800.jpg";
import chestPressGif from "@/imports/1_Chest-Press-Machine_gif.gif";
import tricepsDipsImg from "@/imports/2_-_Assisted_Triceps_Dips_imagen.jpg";
import tricepsDipsGif from "@/imports/2_Assisted_Triceps_Dips_gif.gif";
import legExtImg from "@/imports/3_Leg_Extension_imagen.png";
import legExtGif from "@/imports/3_Leg_extension_gif.gif";
import facePullImg from "@/imports/4__Face_Pull_imagen.jpg";
import facePullGif from "@/imports/4_Face-Pull_gif.gif";
import treadmillImg from "@/imports/5_Treadmill__imagen.png";
import treadmillGif from "@/imports/5_Treadmill-_gif.gif";
import inclineChestImg from "@/imports/6_Incline_Chest_Press_Machine_image.jpg";
import inclineChestGif from "@/imports/6_Incline-Chest-Press-Machine_gif.gif";
import {
  Home, ClipboardList, QrCode, Bot, History,
  Flame, Clock, ChevronRight, Dumbbell, Zap, Trophy,
  Bell, TrendingUp, X, CheckCircle2, ImageIcon,
  Wrench, Sparkles, Plus, Search, ChevronLeft,
  Send, ArrowRight, RotateCcw, Mail, Lock, Eye, EyeOff, Minus,
  Star, Gift, BarChart2, Ticket, ChevronDown, ChevronUp,
  Weight, Settings, CreditCard, ShieldCheck, Globe, Moon,
  BellRing, Edit3, LogOut, PlayCircle, Pause, Lock as LockIcon,
  User, ShoppingBag, AlertCircle, MapPin,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────── */
type ProgramInfo = { name: string; level: string; days: number; color: string; desc: string };

const RUTINAS_DATA: Record<string, ProgramInfo[]> = {
  "Tren Superior": [
    { name:"Pecho & Tríceps Starter", level:"Principiante", days:21, color:"#30D158", desc:"Fundamentos de empuje y fuerza superior" },
    { name:"Volumen Total Superior",  level:"Intermedio",   days:30, color:"#FFD60A", desc:"Hipertrofia y definición muscular" },
    { name:"Power Push Program",      level:"Avanzado",     days:42, color:"#FF4D00", desc:"Potencia, explosividad y masa" },
  ],
  "Piernas": [
    { name:"Piernas desde Cero",      level:"Principiante", days:21, color:"#30D158", desc:"Base, estabilidad y movilidad" },
    { name:"Sentadillas & Variantes", level:"Intermedio",   days:28, color:"#FFD60A", desc:"Fuerza funcional y volumen" },
    { name:"Glúteos & Cuádriceps Pro",level:"Avanzado",     days:35, color:"#FF4D00", desc:"Masa muscular y potencia" },
  ],
  "Core": [
    { name:"Core Básico",             level:"Principiante", days:14, color:"#30D158", desc:"Estabilidad y postura correcta" },
    { name:"Abdomen Definido",        level:"Intermedio",   days:21, color:"#FFD60A", desc:"Definición y resistencia central" },
    { name:"Core Atlético",           level:"Avanzado",     days:28, color:"#FF4D00", desc:"Potencia funcional avanzada" },
  ],
  "Cardio": [
    { name:"Cardio Suave",            level:"Principiante", days:14, color:"#30D158", desc:"Resistencia cardiovascular básica" },
    { name:"HIIT 3x Semana",          level:"Intermedio",   days:21, color:"#7B61FF", desc:"Quema de grasa efectiva" },
    { name:"Cardio de Rendimiento",   level:"Avanzado",     days:30, color:"#FF4D00", desc:"Acondicionamiento de alto nivel" },
  ],
  "Full Body": [
    { name:"Full Body Starter",       level:"Principiante", days:28, color:"#30D158", desc:"Cuerpo completo equilibrado" },
    { name:"Desarrollo Muscular 30D", level:"Intermedio",   days:30, color:"#7B61FF", desc:"Hipertrofia total en 30 días" },
    { name:"Rendimiento Élite",       level:"Avanzado",     days:42, color:"#FF4D00", desc:"Programa de atleta completo" },
  ],
};

type DayPlan = { dia: number; focus: string; tipo: "entrenamiento"|"descanso"; dur: string; kcal: string; ejercicios: { nombre:string; series:string; reps:string; desc:string }[] };

const DIAS_PLAN: DayPlan[] = [
  // SEMANA 1
  { dia:1,  focus:"Pecho & Tríceps",  tipo:"entrenamiento", dur:"45 min", kcal:"420", ejercicios:[
    { nombre:"Press de Banca",          series:"4", reps:"10", desc:"Barra libre, agarre ancho" },
    { nombre:"Press Inclinado",         series:"3", reps:"12", desc:"Mancuernas 30°, contracción superior" },
    { nombre:"Aperturas en Cable",      series:"3", reps:"15", desc:"Arco completo, sin bloquear codos" },
    { nombre:"Press Francés",           series:"3", reps:"10", desc:"Tríceps, barra EZ sobre la frente" },
    { nombre:"Extensión en Polea",      series:"3", reps:"12", desc:"Tríceps con cuerda, codos fijos" },
  ]},
  { dia:2,  focus:"Espalda & Bíceps",  tipo:"entrenamiento", dur:"50 min", kcal:"480", ejercicios:[
    { nombre:"Jalón al Pecho",          series:"4", reps:"10", desc:"Agarre pronado ancho, codos al cuerpo" },
    { nombre:"Remo con Barra",          series:"4", reps:"8",  desc:"Espalda neutra, tirón al ombligo" },
    { nombre:"Remo en Máquina",         series:"3", reps:"12", desc:"Contracción completa en cada rep" },
    { nombre:"Curl con Barra EZ",       series:"3", reps:"12", desc:"Agarre supinado, codos fijos" },
    { nombre:"Martillo Alterno",        series:"3", reps:"12", desc:"Agarre neutro, bíceps braquial" },
  ]},
  { dia:3,  focus:"Tren Inferior",     tipo:"entrenamiento", dur:"55 min", kcal:"520", ejercicios:[
    { nombre:"Sentadilla Libre",        series:"4", reps:"8",  desc:"Barra en trapecio, profundidad completa" },
    { nombre:"Prensa de Piernas",       series:"3", reps:"12", desc:"Pies al ancho de caderas, rodillas libres" },
    { nombre:"Extensiones de Cuáds.",   series:"3", reps:"15", desc:"Máquina, contracción en el punto alto" },
    { nombre:"Curl Femoral",            series:"3", reps:"12", desc:"Tumbado, tobillo con apoyo" },
    { nombre:"Elevación de Talones",    series:"4", reps:"20", desc:"Rango completo, pausa en extensión" },
  ]},
  { dia:4,  focus:"Descanso activo",   tipo:"descanso",      dur:"—",     kcal:"—",   ejercicios:[] },
  { dia:5,  focus:"Hombros & Core",    tipo:"entrenamiento", dur:"40 min", kcal:"360", ejercicios:[
    { nombre:"Press Militar",           series:"4", reps:"8",  desc:"Barra o mancuernas, núcleo activo" },
    { nombre:"Elevaciones Laterales",   series:"4", reps:"15", desc:"Mancuernas ligeras, codos ligeramente flexos" },
    { nombre:"Face Pull",               series:"3", reps:"15", desc:"Cable alto, tracción al rostro" },
    { nombre:"Plancha Abdominal",       series:"3", reps:"60s",desc:"Cuerpo recto, glúteos apretados" },
    { nombre:"Crunches en Polea",       series:"3", reps:"15", desc:"Polea alta con cuerda, arrodillado" },
  ]},
  { dia:6,  focus:"Full Body Express", tipo:"entrenamiento", dur:"35 min", kcal:"310", ejercicios:[
    { nombre:"Sentadilla Goblet",       series:"3", reps:"15", desc:"Mancuerna pesada, torso erguido" },
    { nombre:"Remo con Mancuerna",      series:"3", reps:"12", desc:"Un brazo, codo en el muslo" },
    { nombre:"Fondos en Paralelas",     series:"3", reps:"12", desc:"Cuerpo vertical para tríceps" },
    { nombre:"Peso Muerto Rumano",      series:"3", reps:"12", desc:"Mancuernas, espalda neutra" },
    { nombre:"Curl Concentrado",        series:"3", reps:"12", desc:"Un brazo, codo en el muslo" },
  ]},
  { dia:7,  focus:"Descanso total",    tipo:"descanso",      dur:"—",     kcal:"—",   ejercicios:[] },
  // SEMANA 2
  { dia:8,  focus:"Pecho — Volumen",   tipo:"entrenamiento", dur:"48 min", kcal:"440", ejercicios:[
    { nombre:"Press Banca Inclinado",   series:"4", reps:"10", desc:"Barra, 30°, énfasis en pecho superior" },
    { nombre:"Pec Deck / Contractor",   series:"3", reps:"15", desc:"Contracción máxima, codos semiflexos" },
    { nombre:"Aperturas en Cable",      series:"4", reps:"12", desc:"Poleas cruzadas a altura media" },
    { nombre:"Press Banca Declinado",   series:"3", reps:"10", desc:"Pecho inferior, agarre ancho" },
    { nombre:"Fondos para Pecho",       series:"3", reps:"12", desc:"Torso inclinado hacia adelante" },
  ]},
  { dia:9,  focus:"Espalda — Anchura", tipo:"entrenamiento", dur:"52 min", kcal:"490", ejercicios:[
    { nombre:"Dominadas",               series:"4", reps:"8",  desc:"Agarre pronado ancho, peso corporal" },
    { nombre:"Jalón Agarre Cerrado",    series:"3", reps:"12", desc:"Maneral V, enfatiza dorsal inferior" },
    { nombre:"Pull Over en Polea",      series:"3", reps:"12", desc:"Brazos rígidos, estiramiento completo" },
    { nombre:"Remo T-Bar",              series:"4", reps:"10", desc:"Pecho en apoyo, tirón al esternón" },
    { nombre:"Encogimientos de Hombros",series:"3", reps:"15", desc:"Mancuernas, contracción en lo alto" },
  ]},
  { dia:10, focus:"Piernas — Fuerza",  tipo:"entrenamiento", dur:"60 min", kcal:"550", ejercicios:[
    { nombre:"Sentadilla Frontal",      series:"4", reps:"6",  desc:"Barra en clavículas, cuádriceps máximos" },
    { nombre:"Sentadilla Hack",         series:"3", reps:"10", desc:"Máquina, rodillas sobre pies" },
    { nombre:"Hip Thrust",              series:"4", reps:"12", desc:"Barra con almohadilla, glúteos" },
    { nombre:"Peso Muerto Rumano",      series:"3", reps:"10", desc:"Isquios y glúteos, espalda neutra" },
    { nombre:"Elevación en Prensa",     series:"4", reps:"20", desc:"Pies altos en la plataforma" },
  ]},
  { dia:11, focus:"Descanso activo",   tipo:"descanso",      dur:"—",     kcal:"—",   ejercicios:[] },
  { dia:12, focus:"Hombros — Fuerza",  tipo:"entrenamiento", dur:"42 min", kcal:"375", ejercicios:[
    { nombre:"Press Arnold",            series:"4", reps:"10", desc:"Rotación de muñecas en el recorrido" },
    { nombre:"Elevaciones Laterales",   series:"4", reps:"15", desc:"Mancuernas, codos ligeramente flexos" },
    { nombre:"Pájaros / Rear Delt",     series:"3", reps:"15", desc:"Banco inclinado, deltoides posterior" },
    { nombre:"Remo al Mentón",          series:"3", reps:"12", desc:"Barra Z, agarre estrecho" },
    { nombre:"Ab Wheel Rollouts",       series:"3", reps:"10", desc:"Extensión controlada, rodillas en suelo" },
  ]},
  { dia:13, focus:"Brazos — Volumen",  tipo:"entrenamiento", dur:"38 min", kcal:"320", ejercicios:[
    { nombre:"Curl con Barra EZ",       series:"4", reps:"10", desc:"Agarre supinado, codos fijos" },
    { nombre:"Curl Predicador",         series:"3", reps:"12", desc:"Barra Z, aislamiento de bíceps" },
    { nombre:"Press Francés",           series:"4", reps:"10", desc:"Tríceps, barra EZ sobre frente" },
    { nombre:"Fondos entre Bancos",     series:"3", reps:"15", desc:"Con discos encima para carga extra" },
    { nombre:"Curl Martillo Polea",     series:"3", reps:"12", desc:"Polea con cuerda, braquiorradial" },
  ]},
  { dia:14, focus:"Descanso total",    tipo:"descanso",      dur:"—",     kcal:"—",   ejercicios:[] },
  // SEMANA 3
  { dia:15, focus:"Pecho — Definición",tipo:"entrenamiento", dur:"45 min", kcal:"430", ejercicios:[
    { nombre:"Press con Mancuernas",    series:"4", reps:"12", desc:"Banco plano, rango completo" },
    { nombre:"Cruce de Poleas Altas",   series:"4", reps:"15", desc:"Cables, arco amplio y contracción" },
    { nombre:"Cruce de Poleas Bajas",   series:"3", reps:"15", desc:"Énfasis en pecho superior" },
    { nombre:"Flexiones de Pecho",      series:"3", reps:"20", desc:"Técnica perfecta, tronco activo" },
    { nombre:"Patada de Tríceps",       series:"3", reps:"15", desc:"Mancuerna o polea, codo fijo" },
  ]},
  { dia:16, focus:"Espalda — Grosor",  tipo:"entrenamiento", dur:"50 min", kcal:"480", ejercicios:[
    { nombre:"Peso Muerto Conv.",       series:"4", reps:"5",  desc:"Barra, arranque desde el suelo" },
    { nombre:"Remo con Barra Supino",   series:"4", reps:"10", desc:"Agarre supino, énfasis bíceps" },
    { nombre:"Remo Sentado Polea",      series:"3", reps:"12", desc:"Maneral V, tirón al abdomen" },
    { nombre:"Remo en Máq. Articulada",series:"3", reps:"12", desc:"Palancas, contracción bilateral" },
    { nombre:"Curl Inclinado",          series:"3", reps:"12", desc:"Banco 45°, estiramiento bíceps" },
  ]},
  { dia:17, focus:"Piernas — Glúteos", tipo:"entrenamiento", dur:"55 min", kcal:"530", ejercicios:[
    { nombre:"Hip Thrust con Barra",    series:"4", reps:"12", desc:"Almohadilla, empuje con glúteos" },
    { nombre:"Sentadilla Búlgara",      series:"4", reps:"10", desc:"Pie trasero elevado, profundidad" },
    { nombre:"Patada en Polea",         series:"3", reps:"15", desc:"Glúteo aislado, polea baja" },
    { nombre:"Abducción en Máquina",    series:"3", reps:"20", desc:"Glúteo medio, contracción lateral" },
    { nombre:"Curl Femoral Sentado",    series:"4", reps:"12", desc:"Máquina, rango completo" },
  ]},
  { dia:18, focus:"Descanso activo",   tipo:"descanso",      dur:"—",     kcal:"—",   ejercicios:[] },
  { dia:19, focus:"Hombros — Bombeo",  tipo:"entrenamiento", dur:"40 min", kcal:"355", ejercicios:[
    { nombre:"Press de Hombros Sent.",  series:"4", reps:"12", desc:"Mancuernas, recorrido controlado" },
    { nombre:"Elevaciones Laterales",   series:"5", reps:"15", desc:"Series de alto volumen" },
    { nombre:"Elevaciones Frontales",   series:"3", reps:"12", desc:"Disco o mancuerna, sin inercia" },
    { nombre:"Deltoides Posterior",     series:"3", reps:"15", desc:"Reverse pec deck o pájaros" },
    { nombre:"Elevaciones de Rodillas", series:"3", reps:"15", desc:"Silla capitán, control lumbar" },
  ]},
  { dia:20, focus:"Full Body Potencia",tipo:"entrenamiento", dur:"50 min", kcal:"480", ejercicios:[
    { nombre:"Sentadilla con Salto",    series:"4", reps:"8",  desc:"Explosivo en la subida, aterrizaje suave" },
    { nombre:"Dominadas",               series:"4", reps:"8",  desc:"Peso corporal o lastrado" },
    { nombre:"Press Banca Explosivo",   series:"4", reps:"6",  desc:"Fase concéntrica máxima velocidad" },
    { nombre:"Kettlebell Swings",       series:"3", reps:"20", desc:"Bisagra de cadera, núcleo activo" },
    { nombre:"Burpees",                 series:"3", reps:"10", desc:"Alta intensidad, mínima pausa" },
  ]},
  { dia:21, focus:"Descanso total",    tipo:"descanso",      dur:"—",     kcal:"—",   ejercicios:[] },
  // SEMANA 4
  { dia:22, focus:"Pecho — Test PR",   tipo:"entrenamiento", dur:"50 min", kcal:"460", ejercicios:[
    { nombre:"Press de Banca",          series:"5", reps:"5",  desc:"Cargas altas, técnica impecable" },
    { nombre:"Press Banca Inclinado",   series:"4", reps:"8",  desc:"Mancuernas, rango completo" },
    { nombre:"Aperturas Banco Plano",   series:"3", reps:"15", desc:"Mancuernas, arco amplio" },
    { nombre:"Press Agarre Cerrado",    series:"4", reps:"8",  desc:"Tríceps como foco principal" },
    { nombre:"Extensión Tras Nuca",     series:"3", reps:"12", desc:"Mancuerna, codos pegados" },
  ]},
  { dia:23, focus:"Espalda — Test PR",  tipo:"entrenamiento", dur:"55 min", kcal:"510", ejercicios:[
    { nombre:"Dominadas Lastradas",     series:"5", reps:"5",  desc:"Cinturón con disco, agarre pronado" },
    { nombre:"Remo Pendlay",            series:"5", reps:"5",  desc:"Cada rep desde el suelo, explosivo" },
    { nombre:"Jalón al Pecho",          series:"4", reps:"10", desc:"Agarre ancho, codos al cuerpo" },
    { nombre:"Pull Over Polea",         series:"3", reps:"12", desc:"Brazos rígidos, dorsal" },
    { nombre:"Curl Barra EZ",           series:"3", reps:"10", desc:"Carga progresiva, codos fijos" },
  ]},
  { dia:24, focus:"Piernas — Test PR",  tipo:"entrenamiento", dur:"60 min", kcal:"560", ejercicios:[
    { nombre:"Sentadilla Libre",        series:"5", reps:"3",  desc:"Carga máxima, control total" },
    { nombre:"Prensa de Piernas",       series:"4", reps:"10", desc:"Rango completo, sin bloquear" },
    { nombre:"Hip Thrust",              series:"5", reps:"10", desc:"Carga progresiva, pausa en alto" },
    { nombre:"Peso Muerto Rumano",      series:"4", reps:"8",  desc:"Carga máxima controlada" },
    { nombre:"Elevación de Talones",    series:"5", reps:"20", desc:"Pausa abajo, explosión arriba" },
  ]},
  { dia:25, focus:"Descanso activo",   tipo:"descanso",      dur:"—",     kcal:"—",   ejercicios:[] },
  { dia:26, focus:"Hombros & Brazos",  tipo:"entrenamiento", dur:"48 min", kcal:"410", ejercicios:[
    { nombre:"Press Militar",           series:"5", reps:"5",  desc:"Barra, carga máxima" },
    { nombre:"Elevaciones Laterales",   series:"4", reps:"15", desc:"Superset con curl de bíceps" },
    { nombre:"Curl con Barra EZ",       series:"4", reps:"10", desc:"Carga máxima, técnica perfecta" },
    { nombre:"Press Francés",           series:"4", reps:"8",  desc:"Barra Z, carga máxima" },
    { nombre:"Face Pull",               series:"3", reps:"20", desc:"Salud del manguito rotador" },
  ]},
  { dia:27, focus:"Cardio & Core",     tipo:"entrenamiento", dur:"35 min", kcal:"290", ejercicios:[
    { nombre:"Cinta de Correr",         series:"1", reps:"20m",desc:"Ritmo moderado, frecuencia cardiaca 65%" },
    { nombre:"Plancha Abdominal",       series:"4", reps:"60s",desc:"Posición neutral de columna" },
    { nombre:"Giros Rusos",             series:"3", reps:"20", desc:"Disco o peso, rotación controlada" },
    { nombre:"Elevaciones de Piernas",  series:"3", reps:"15", desc:"Colgado de barra, control lumbar" },
    { nombre:"Bird Dog",                series:"3", reps:"12", desc:"Columna neutra, extensión alternada" },
  ]},
  { dia:28, focus:"Descanso total",    tipo:"descanso",      dur:"—",     kcal:"—",   ejercicios:[] },
];

/* ─────────────────────────────────────────────────────────────
   ROUTER
───────────────────────────────────────────────────────────── */
type Route =
  | "login" | "onboarding"
  | "inicio" | "qr" | "chatbot" | "historial" | "planes"
  | "plan-manual" | "plan-ia"
  | "workout-summary" | "workout-session" | "single-exercise" | "historial-stats"
  | "gamification" | "coupon-wallet"
  | "profile" | "settings"
  | "rutina-categoria" | "rutina-detalle"
  | "maquina-detalle"
  | "guia-maquinas"
  | "mis-plan-detalle"
  | "tienda-premios";

type EarnedCoupon = { title:string; code:string; emoji:string; color:string; pts:number; exp:string; subtitle:string };
type PlanExercise = { name:string; series:string; reps:string; rest:string };
type PlanDay = { dia:number; isRest:boolean; exercises:PlanExercise[] };
type SavedPlan = { name:string; days:number; type:"manual"|"ia"; muscle?:string; freq?:number; duration?:number; planDays: PlanDay[] };

type NavTab = "perfil" | "inicio" | "planes" | "qr" | "chatbot" | "progreso" | "premios";

function activeTab(r: Route): NavTab {
  if (r === "planes" || r === "plan-manual" || r === "plan-ia" || r === "rutina-categoria" || r === "rutina-detalle" || r === "mis-plan-detalle") return "planes";
  if (r === "qr" || r === "maquina-detalle") return "qr";
  if (r === "chatbot")   return "chatbot";
  if (r === "historial" || r === "historial-stats") return "progreso";
  if (r === "gamification" || r === "coupon-wallet" || r === "tienda-premios") return "premios";
  if (r === "profile" || r === "settings") return "perfil";
  if (r === "guia-maquinas") return "inicio";
  return "inicio";
}

const SHOW_NAV_ROUTES: Route[] = ["inicio","planes","qr","chatbot","historial","gamification","profile","coupon-wallet","settings","tienda-premios","mis-plan-detalle","guia-maquinas"];

/* ─────────────────────────────────────────────────────────────
   SHARED ATOMS
───────────────────────────────────────────────────────────── */
function StatusBar() {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 24px 4px", flexShrink:0 }}>
      <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"14px", fontWeight:600, color:"#8E8EA0" }}>9:41</span>
      <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
        <div style={{ width:"16px", height:"8px", borderRadius:"2px", background:"rgba(255,255,255,0.3)" }}/>
        <div style={{ width:"12px", height:"8px", borderRadius:"2px", background:"rgba(255,255,255,0.3)" }}/>
        <div style={{ width:"24px", height:"12px", borderRadius:"2px", border:"1px solid rgba(255,255,255,0.3)", position:"relative" }}>
          <div style={{ position:"absolute", inset:"2px", borderRadius:"1px", background:"#30D158" }}/>
        </div>
      </div>
    </div>
  );
}

// Nav route mappings for the 7-item bar
const NAV_ROUTE_MAP: Record<NavTab, Route> = {
  perfil:"profile", inicio:"inicio", planes:"planes", qr:"qr", chatbot:"chatbot", progreso:"historial", premios:"gamification"
};
const NAV_ITEMS: { id: NavTab; label: string; icon: React.ElementType }[] = [
  { id:"inicio",  label:"Inicio",    icon:Home },
  { id:"planes",  label:"Rutinas",   icon:ClipboardList },
  { id:"chatbot", label:"Coach IA",  icon:Bot },
  { id:"qr",      label:"Escanear",  icon:QrCode },
  { id:"progreso",label:"Progreso",  icon:TrendingUp },
  { id:"premios", label:"Premios",   icon:Trophy },
  { id:"perfil",  label:"Mi Perfil", icon:User },
];

function BottomNav({ active, onNav }: { active: NavTab; onNav:(t:NavTab)=>void }) {
  return (
    <div style={{ position:"absolute", bottom:0, left:0, right:0, background:"rgba(10,10,18,0.97)", backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)", borderTop:"1px solid rgba(255,255,255,0.07)", paddingBottom:"18px", paddingTop:"6px", zIndex:50 }}>
      <div style={{ display:"flex", alignItems:"center" }}>
        {NAV_ITEMS.map(({ id, label, icon:Icon }) => {
          const isActive = active === id;
          const isQR = id === "qr";
          if (isQR) return (
            <button key={id} onClick={()=>onNav(id)} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:"3px", border:"none", background:"none", cursor:"pointer" }}>
              <div style={{ width:"44px", height:"44px", borderRadius:"14px", marginTop:"-18px", background:isActive?"linear-gradient(135deg,#FF4D00,#FF7A00)":"linear-gradient(135deg,#2a1500,#3d1f00)", border:isActive?"2px solid rgba(255,120,0,0.4)":"2px solid rgba(255,77,0,0.2)", boxShadow:isActive?"0 4px 20px rgba(255,77,0,0.5)":"0 2px 8px rgba(0,0,0,0.4)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Icon size={19} color={isActive?"#fff":"#FF4D00"}/>
              </div>
              <span style={{ fontSize:"8px", fontWeight:700, color:isActive?"#FF4D00":"#8E8EA0", fontFamily:"'Barlow',sans-serif" }}>{label}</span>
            </button>
          );
          return (
            <button key={id} onClick={()=>onNav(id)} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:"3px", paddingTop:"3px", border:"none", background:"none", cursor:"pointer" }}>
              <div style={{ width:"30px", height:"30px", borderRadius:"10px", background:isActive?"rgba(255,77,0,0.15)":"transparent", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Icon size={17} color={isActive?"#FF4D00":"#8E8EA0"} style={isActive?{filter:"drop-shadow(0 0 4px rgba(255,77,0,0.6))"}:{}}/>
              </div>
              <span style={{ fontSize:"8px", fontWeight:isActive?700:500, color:isActive?"#FF4D00":"#8E8EA0", fontFamily:"'Barlow',sans-serif" }}>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function BackHeader({ title, subtitle, onBack }: { title:string; subtitle?:string; onBack:()=>void }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:"12px", padding:"14px 24px 0", flexShrink:0 }}>
      <button onClick={onBack} style={{ width:"36px", height:"36px", borderRadius:"12px", background:"#141420", border:"1px solid rgba(255,255,255,0.08)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:0 }}>
        <ChevronLeft size={20} color="#8E8EA0"/>
      </button>
      <div>
        <h2 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"22px", fontWeight:800, color:"#F2F2F7", lineHeight:1 }}>{title}</h2>
        {subtitle && <p style={{ fontSize:"11px", color:"#8E8EA0", marginTop:"2px" }}>{subtitle}</p>}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   LOGIN
═══════════════════════════════════════════════════════════ */
function LoginScreen({ nav }: { nav:(r:Route)=>void }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  return (
    <div style={{ flex:1, overflowY:"auto", scrollbarWidth:"none" }}>
      <div style={{ position:"absolute", top:"-80px", left:"50%", transform:"translateX(-50%)", width:"320px", height:"320px", borderRadius:"50%", background:"radial-gradient(circle,rgba(255,77,0,0.15),transparent 70%)", pointerEvents:"none", zIndex:0 }}/>
      <div style={{ position:"relative", zIndex:1 }}>
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", paddingTop:"16px", paddingBottom:"12px" }}>
          {/* Official logo */}
          <div style={{ position:"relative", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <div style={{ position:"absolute", inset:"-20px", borderRadius:"50%", background:"radial-gradient(circle,rgba(255,77,0,0.18),transparent 70%)", pointerEvents:"none" }}/>
            <ImageWithFallback
              src={logoImg}
              alt="Imperium Cross"
              style={{ width:"200px", objectFit:"contain" }}
            />
          </div>
          <p style={{ fontSize:"12px", color:"#8E8EA0", marginTop:"2px", letterSpacing:"0.06em" }}>Tu entrenamiento, potenciado por IA</p>
        </div>
        <div style={{ padding:"0 28px", display:"flex", flexDirection:"column", gap:"10px" }}>
          <div>
            <p style={{ fontSize:"11px", color:"#8E8EA0", fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:"6px" }}>Correo Electrónico</p>
            <div style={{ display:"flex", alignItems:"center", gap:"12px", background:"#141420", borderRadius:"14px", border:email?"1.5px solid rgba(255,77,0,0.45)":"1px solid rgba(255,255,255,0.08)", padding:"0 16px" }}>
              <Mail size={16} color="#8E8EA0" style={{ flexShrink:0 }}/>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="correo@gimnasio.com" style={{ flex:1, background:"none", border:"none", outline:"none", color:"#F2F2F7", fontSize:"14px", fontFamily:"'Barlow',sans-serif", padding:"13px 0" }}/>
            </div>
          </div>
          <div>
            <p style={{ fontSize:"11px", color:"#8E8EA0", fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:"6px" }}>Contraseña</p>
            <div style={{ display:"flex", alignItems:"center", gap:"12px", background:"#141420", borderRadius:"14px", border:password?"1.5px solid rgba(255,77,0,0.45)":"1px solid rgba(255,255,255,0.08)", padding:"0 16px" }}>
              <Lock size={16} color="#8E8EA0" style={{ flexShrink:0 }}/>
              <input type={showPass?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" style={{ flex:1, background:"none", border:"none", outline:"none", color:"#F2F2F7", fontSize:"14px", fontFamily:"'Barlow',sans-serif", padding:"13px 0" }}/>
              <button onClick={()=>setShowPass(v=>!v)} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", padding:"4px" }}>{showPass?<Eye size={16} color="#8E8EA0"/>:<EyeOff size={16} color="#8E8EA0"/>}</button>
            </div>
            <div style={{ textAlign:"right", marginTop:"8px" }}><button style={{ background:"none", border:"none", cursor:"pointer", fontSize:"12px", color:"#FF4D00", fontWeight:600 }}>¿Olvidaste tu contraseña?</button></div>
          </div>
          <button onClick={()=>nav("inicio")} style={{ width:"100%", padding:"13px 20px", borderRadius:"16px", background:"linear-gradient(90deg,#FF4D00,#FF7A00)", border:"none", cursor:"pointer", boxShadow:"0 4px 24px rgba(255,77,0,0.45)" }}>
            <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"19px", fontWeight:900, color:"#fff", textTransform:"uppercase", letterSpacing:"0.08em" }}>Iniciar Sesión</span>
          </button>
          <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
            <div style={{ flex:1, height:"1px", background:"rgba(255,255,255,0.08)" }}/>
            <span style={{ fontSize:"12px", color:"#8E8EA0" }}>O ingresa con</span>
            <div style={{ flex:1, height:"1px", background:"rgba(255,255,255,0.08)" }}/>
          </div>
          <div style={{ display:"flex", justifyContent:"center", gap:"16px" }}>
            <button style={{ width:"50px", height:"50px", borderRadius:"50%", background:"#141420", border:"1px solid rgba(255,255,255,0.1)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            </button>
            <button style={{ width:"50px", height:"50px", borderRadius:"50%", background:"#141420", border:"1px solid rgba(255,255,255,0.1)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#F2F2F7"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.31.07 2.22.74 2.98.8 1.12-.23 2.2-.93 3.39-.84 1.44.12 2.53.7 3.24 1.79-2.98 1.8-2.27 5.75.48 6.87-.57 1.57-1.32 3.14-2.09 4.26zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
            </button>
          </div>
          <p style={{ textAlign:"center", fontSize:"13px", color:"#8E8EA0", paddingBottom:"20px" }}>¿No tienes cuenta?{" "}<button onClick={()=>nav("onboarding")} style={{ background:"none", border:"none", cursor:"pointer", color:"#FF4D00", fontWeight:700, fontSize:"13px", fontFamily:"'Barlow',sans-serif" }}>Regístrate aquí</button></p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ONBOARDING — CR circle removed
═══════════════════════════════════════════════════════════ */
function OnboardingScreen({ nav }: { nav:(r:Route)=>void }) {
  const [phase,    setPhase]   = useState<1|2>(1);
  const [animOut,  setAnimOut] = useState(false);
  const [email,    setEmail]   = useState("");
  const [pass,     setPass]    = useState("");
  const [showPass, setShowPass]= useState(false);
  const [height,   setHeight]  = useState(175);
  const [weight,   setWeight]  = useState(78);
  const [age,      setAge]     = useState(26);
  const [level,    setLevel]   = useState<"Principiante"|"Intermedio"|"Avanzado">("Intermedio");
  const lc: Record<string,string> = { Principiante:"#30D158", Intermedio:"#FFD60A", Avanzado:"#FF4D00" };

  function goPhase2() {
    setAnimOut(true);
    setTimeout(() => { setPhase(2); setAnimOut(false); }, 320);
  }

  function Slider({ label, unit, value, min, max, onChange }: { label:string;unit:string;value:number;min:number;max:number;onChange:(v:number)=>void }) {
    const pct = ((value-min)/(max-min))*100;
    return (
      <div style={{ marginBottom:"13px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:"7px" }}>
          <span style={{ fontSize:"12px", color:"#8E8EA0", fontWeight:600 }}>{label}</span>
          <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"22px", fontWeight:800, color:"#FF4D00" }}>{value}<span style={{ fontSize:"12px", color:"#8E8EA0", marginLeft:"3px" }}>{unit}</span></span>
        </div>
        <div style={{ position:"relative", height:"6px", borderRadius:"3px", background:"rgba(255,255,255,0.08)" }}>
          <div style={{ position:"absolute", left:0, top:0, bottom:0, borderRadius:"3px", background:"linear-gradient(90deg,#FF4D00,#FF7A00)", width:`${pct}%` }}/>
          <input type="range" min={min} max={max} value={value} onChange={e=>onChange(Number(e.target.value))} style={{ position:"absolute", inset:0, width:"100%", opacity:0, cursor:"pointer", height:"100%" }}/>
          <div style={{ position:"absolute", top:"50%", left:`${pct}%`, transform:"translate(-50%,-50%)", width:"18px", height:"18px", borderRadius:"50%", background:"linear-gradient(135deg,#FF4D00,#FF7A00)", border:"2.5px solid #0B0B12", boxShadow:"0 2px 8px rgba(255,77,0,0.5)", pointerEvents:"none" }}/>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:"6px" }}>
          <span style={{ fontSize:"10px", color:"#3A3A50" }}>{min} {unit}</span>
          <span style={{ fontSize:"10px", color:"#3A3A50" }}>{max} {unit}</span>
        </div>
      </div>
    );
  }

  const slideStyle: React.CSSProperties = {
    transition: "opacity 0.32s ease, transform 0.32s ease",
    opacity: animOut ? 0 : 1,
    transform: animOut ? "translateX(-24px)" : "translateX(0)",
  };

  return (
    <div style={{ flex:1, overflowY:"auto", scrollbarWidth:"none" }}>
      {/* Step indicator */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 24px 0" }}>
        <div style={{ display:"flex", gap:"6px" }}>
          {[1,2].map(s=>(
            <div key={s} style={{ height:"3px", width: s===phase ? "28px" : "14px", borderRadius:"2px", background: s===phase ? "#FF4D00" : "rgba(255,255,255,0.12)", transition:"all 0.3s ease" }}/>
          ))}
        </div>
        <button onClick={()=>nav("inicio")} style={{ background:"none", border:"none", cursor:"pointer", fontSize:"13px", color:"#8E8EA0" }}>Saltar</button>
      </div>

      <div style={{ textAlign:"center", padding:"6px 32px 0" }}>
        <ImageWithFallback src={logoImg} alt="Imperium Cross" style={{ width:"110px", objectFit:"contain", margin:"0 auto 6px" }}/>
        <div style={{ width:"36px", height:"3px", borderRadius:"2px", background:"linear-gradient(90deg,#FF4D00,#FF7A00)", margin:"0 auto 8px" }}/>
        <h1 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"24px", fontWeight:900, color:"#F2F2F7", textTransform:"uppercase" }}>
          {phase===1 ? "Crea tu Cuenta" : "Cuéntanos sobre ti"}
        </h1>
        <p style={{ fontSize:"12px", color:"#8E8EA0", marginTop:"4px", lineHeight:1.4 }}>
          {phase===1 ? "Ingresa tus datos de acceso" : "Personalizaremos tus rutinas con IA"}
        </p>
      </div>

      <div style={{ padding:"12px 24px 0", ...slideStyle }}>
        {phase === 1 ? (
          <>
            <div style={{ background:"#141420", borderRadius:"20px", border:"1px solid rgba(255,255,255,0.07)", padding:"16px 18px", display:"flex", flexDirection:"column", gap:"12px" }}>
              {/* Email */}
              <div>
                <label style={{ fontSize:"11px", color:"#8E8EA0", fontWeight:600, letterSpacing:"0.05em", textTransform:"uppercase", display:"block", marginBottom:"6px" }}>Correo electrónico</label>
                <div style={{ position:"relative" }}>
                  <Mail size={15} color="#8E8EA0" style={{ position:"absolute", left:"12px", top:"50%", transform:"translateY(-50%)" }}/>
                  <input
                    type="email"
                    placeholder="tu@correo.com"
                    value={email}
                    onChange={e=>setEmail(e.target.value)}
                    style={{ width:"100%", padding:"11px 12px 11px 36px", background:"#0B0B12", border:"1.5px solid rgba(255,255,255,0.1)", borderRadius:"12px", color:"#F2F2F7", fontSize:"14px", fontFamily:"'Barlow',sans-serif", outline:"none", boxSizing:"border-box" }}
                  />
                </div>
              </div>
              {/* Password */}
              <div>
                <label style={{ fontSize:"11px", color:"#8E8EA0", fontWeight:600, letterSpacing:"0.05em", textTransform:"uppercase", display:"block", marginBottom:"6px" }}>Contraseña</label>
                <div style={{ position:"relative" }}>
                  <Lock size={15} color="#8E8EA0" style={{ position:"absolute", left:"12px", top:"50%", transform:"translateY(-50%)" }}/>
                  <input
                    type={showPass?"text":"password"}
                    placeholder="Mínimo 8 caracteres"
                    value={pass}
                    onChange={e=>setPass(e.target.value)}
                    style={{ width:"100%", padding:"11px 40px 11px 36px", background:"#0B0B12", border:"1.5px solid rgba(255,255,255,0.1)", borderRadius:"12px", color:"#F2F2F7", fontSize:"14px", fontFamily:"'Barlow',sans-serif", outline:"none", boxSizing:"border-box" }}
                  />
                  <button onClick={()=>setShowPass(v=>!v)} style={{ position:"absolute", right:"12px", top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", padding:0 }}>
                    {showPass ? <EyeOff size={15} color="#8E8EA0"/> : <Eye size={15} color="#8E8EA0"/>}
                  </button>
                </div>
              </div>
            </div>
            <button onClick={goPhase2} style={{ width:"100%", padding:"13px", borderRadius:"16px", background:"linear-gradient(90deg,#FF4D00,#FF7A00)", border:"none", cursor:"pointer", boxShadow:"0 4px 24px rgba(255,77,0,0.45)", marginTop:"14px", marginBottom:"16px" }}>
              <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"19px", fontWeight:900, color:"#fff", textTransform:"uppercase", letterSpacing:"0.07em" }}>Continuar →</span>
            </button>
          </>
        ) : (
          <>
            <div style={{ background:"#141420", borderRadius:"20px", border:"1px solid rgba(255,255,255,0.07)", padding:"14px 18px 4px" }}>
              <Slider label="Estatura" unit="cm" value={height} min={140} max={210} onChange={setHeight}/>
              <Slider label="Peso actual" unit="kg" value={weight} min={40} max={150} onChange={setWeight}/>
              <div style={{ marginBottom:"10px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontSize:"13px", color:"#8E8EA0", fontWeight:600 }}>Edad</span>
                  <div style={{ display:"flex" }}>
                    <button onClick={()=>setAge(v=>Math.max(14,v-1))} style={{ width:"36px", height:"36px", borderRadius:"10px 0 0 10px", background:"#0B0B12", border:"1px solid rgba(255,255,255,0.1)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><Minus size={14} color="#8E8EA0"/></button>
                    <div style={{ width:"54px", height:"36px", background:"#0B0B12", border:"1px solid rgba(255,77,0,0.3)", borderLeft:"none", borderRight:"none", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"20px", fontWeight:800, color:"#FF4D00" }}>{age}</span>
                    </div>
                    <button onClick={()=>setAge(v=>Math.min(80,v+1))} style={{ width:"36px", height:"36px", borderRadius:"0 10px 10px 0", background:"#0B0B12", border:"1px solid rgba(255,255,255,0.1)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><Plus size={14} color="#8E8EA0"/></button>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ marginTop:"12px" }}>
              <p style={{ fontSize:"11px", color:"#8E8EA0", fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:"8px" }}>Nivel Físico</p>
              <div style={{ display:"flex", background:"#141420", borderRadius:"16px", border:"1px solid rgba(255,255,255,0.07)", padding:"4px", gap:"4px" }}>
                {(["Principiante","Intermedio","Avanzado"] as const).map(lvl=>{
                  const isA=level===lvl; const c=lc[lvl];
                  return <button key={lvl} onClick={()=>setLevel(lvl)} style={{ flex:1, padding:"10px 4px", borderRadius:"12px", border:"none", cursor:"pointer", background:isA?`${c}22`:"transparent", outline:isA?`1.5px solid ${c}55`:"none" }}>
                    <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"14px", fontWeight:800, color:isA?c:"#8E8EA0" }}>{lvl}</span>
                  </button>;
                })}
              </div>
            </div>
            <div style={{ display:"flex", gap:"8px", marginTop:"10px", flexWrap:"wrap" }}>
              {[`${height} cm`,`${weight} kg`,`${age} años`,level].map(c=>(
                <div key={c} style={{ padding:"5px 12px", background:"rgba(255,77,0,0.1)", borderRadius:"20px", border:"1px solid rgba(255,77,0,0.2)" }}>
                  <span style={{ fontSize:"12px", color:"#FF6B35", fontWeight:600 }}>{c}</span>
                </div>
              ))}
            </div>
            <button onClick={()=>nav("inicio")} style={{ width:"100%", padding:"13px", borderRadius:"16px", background:"linear-gradient(90deg,#FF4D00,#FF7A00)", border:"none", cursor:"pointer", boxShadow:"0 4px 24px rgba(255,77,0,0.45)", marginTop:"12px", marginBottom:"16px" }}>
              <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"19px", fontWeight:900, color:"#fff", textTransform:"uppercase", letterSpacing:"0.07em" }}>Finalizar Perfil</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   HOME
═══════════════════════════════════════════════════════════ */
function HomeScreen({ nav, onStartWorkout, inGym, onToggleGym }: { nav:(r:Route)=>void; onStartWorkout:(exs:PlanExercise[])=>void; inGym:boolean; onToggleGym:(v:boolean)=>void }) {
  const days = [{day:"L",done:true},{day:"M",done:true},{day:"X",active:true},{day:"J"},{day:"V"},{day:"S"},{day:"D"}];
  return (
    <div style={{ flex:1, overflowY:"auto", scrollbarWidth:"none" }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 24px 8px" }}>
        <div>
          <p style={{ fontSize:"12px", color:"#8E8EA0", fontWeight:500, letterSpacing:"0.06em", textTransform:"uppercase" }}>Bienvenido de vuelta</p>
          <h1 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"28px", fontWeight:800, color:"#F2F2F7", lineHeight:1.1 }}>¡Hola, <span style={{ color:"#FF4D00" }}>Carlos!</span></h1>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
          <button style={{ width:"40px", height:"40px", borderRadius:"50%", background:"#141420", border:"1px solid rgba(255,255,255,0.08)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", position:"relative" }}>
            <Bell size={18} color="#8E8EA0"/>
            <span style={{ position:"absolute", top:"4px", right:"4px", width:"7px", height:"7px", borderRadius:"50%", background:"#FF4D00", border:"1.5px solid #0B0B12" }}/>
          </button>
          <button onClick={()=>nav("profile")} style={{ width:"46px", height:"46px", borderRadius:"50%", background:"linear-gradient(135deg,#FF4D00,#FF8C00)", display:"flex", alignItems:"center", justifyContent:"center", border:"2px solid rgba(255,77,0,0.4)", boxShadow:"0 0 16px rgba(255,77,0,0.35)", fontFamily:"'Barlow Condensed',sans-serif", fontSize:"18px", fontWeight:800, color:"#fff", cursor:"pointer" }}>CR</button>
        </div>
      </div>

      {/* Gym mode toggle */}
      <div style={{ padding:"4px 24px 4px", display:"flex", justifyContent:"center" }}>
        <div style={{ display:"inline-flex", background:"#0F0F1A", borderRadius:"14px", border:"1px solid rgba(255,255,255,0.08)", padding:"3px", gap:"2px" }}>
          <button
            onClick={()=>onToggleGym(false)}
            style={{ padding:"7px 14px", borderRadius:"11px", border:"none", cursor:"pointer", background:!inGym?"rgba(255,255,255,0.08)":"transparent", transition:"background 0.2s" }}
          >
            <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"13px", fontWeight:800, color:!inGym?"#F2F2F7":"#5A5A70", letterSpacing:"0.03em" }}>Fuera del gym</span>
          </button>
          <button
            onClick={()=>onToggleGym(true)}
            style={{ padding:"7px 14px", borderRadius:"11px", border:"none", cursor:"pointer", background:inGym?"linear-gradient(90deg,rgba(255,77,0,0.25),rgba(255,122,0,0.2))":"transparent", outline:inGym?"1.5px solid rgba(255,77,0,0.45)":"none", transition:"background 0.2s" }}
          >
            <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"13px", fontWeight:800, color:inGym?"#FF6B35":"#5A5A70", letterSpacing:"0.03em" }}>En el gym 🔥</span>
          </button>
        </div>
      </div>

      {/* 1 — Rutina del Día (first section) */}
      <div style={{ padding:"8px 24px 0" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"8px" }}>
          <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"18px", fontWeight:800, color:"#F2F2F7", textTransform:"uppercase" }}>Rutina del Día</span>
          <button onClick={()=>nav("planes")} style={{ background:"none", border:"none", cursor:"pointer", fontSize:"12px", color:"#FF4D00", fontWeight:600 }}>Ver planes →</button>
        </div>
        <div style={{ borderRadius:"24px", background:"linear-gradient(135deg,#1a0a00 0%,#2d1200 40%,#0d0d1a 100%)", border:"1px solid rgba(255,77,0,0.25)", boxShadow:"0 8px 40px rgba(255,77,0,0.15)", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:"-40px", right:"-40px", width:"180px", height:"180px", borderRadius:"50%", background:"radial-gradient(circle,rgba(255,77,0,0.3),transparent 70%)", pointerEvents:"none" }}/>
          <div style={{ padding:"20px", position:"relative" }}>
            <div style={{ display:"inline-flex", alignItems:"center", padding:"4px 10px", background:"rgba(255,77,0,0.18)", borderRadius:"8px", border:"1px solid rgba(255,77,0,0.3)", marginBottom:"8px" }}>
              <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"11px", fontWeight:700, color:"#FF6B35", textTransform:"uppercase", letterSpacing:"0.08em" }}>MIÉRCOLES — DÍA 3</span>
            </div>
            <h2 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"26px", fontWeight:900, color:"#F2F2F7", lineHeight:1.05, textTransform:"uppercase" }}>FUERZA TOTAL<br/><span style={{ color:"#FF4D00" }}>SEMANA 3</span></h2>
            <div style={{ height:"1px", background:"rgba(255,255,255,0.06)", margin:"14px 0" }}/>
            <div style={{ display:"flex", gap:"10px", marginBottom:"14px" }}>
              <div style={{ flex:1, display:"flex", alignItems:"center", gap:"8px", padding:"8px 10px", background:"linear-gradient(90deg,rgba(255,107,53,0.2),rgba(255,77,0,0.1))", borderRadius:"10px", border:"1px solid rgba(255,107,53,0.3)" }}>
                <Flame size={14} color="#FF6B35" style={{ filter:"drop-shadow(0 0 4px rgba(255,107,53,0.8))" }}/>
                <div><div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"14px", fontWeight:800, color:"#FF6B35" }}>7 días seguidos</div><div style={{ fontSize:"9px", color:"#8E8EA0" }}>Racha activa 🔥</div></div>
              </div>
              <div style={{ flex:1, display:"flex", alignItems:"center", gap:"8px", padding:"8px 10px", background:"rgba(255,255,255,0.04)", borderRadius:"10px", border:"1px solid rgba(255,255,255,0.08)" }}>
                <Clock size={13} color="#8E8EA0"/>
                <div><div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"14px", fontWeight:800, color:"#F2F2F7" }}>~45 min</div><div style={{ fontSize:"9px", color:"#8E8EA0" }}>Tiempo promedio</div></div>
              </div>
            </div>
            <button onClick={()=>onStartWorkout(DEFAULT_WORKOUT)} style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px", background:"linear-gradient(90deg,#FF4D00,#FF7A00)", borderRadius:"14px", padding:"13px 20px", border:"none", cursor:"pointer", boxShadow:"0 4px 20px rgba(255,77,0,0.4)" }}>
              <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"16px", fontWeight:800, color:"#fff", textTransform:"uppercase", letterSpacing:"0.06em" }}>COMENZAR ENTRENAMIENTO</span>
              <ChevronRight size={18} color="#fff"/>
            </button>
          </div>
        </div>
      </div>

      {/* 2 — Guía de Máquinas y Ejercicios card */}
      <div style={{ padding:"12px 24px 0" }}>
        <button
          onClick={()=>nav("guia-maquinas")}
          style={{ width:"100%", display:"flex", alignItems:"center", gap:"14px", borderRadius:"18px", background:"linear-gradient(135deg,#0e0e1c,#1a1030)", border:"1px solid rgba(123,97,255,0.3)", boxShadow:"0 4px 24px rgba(123,97,255,0.12)", padding:"16px 18px", cursor:"pointer", textAlign:"left", overflow:"hidden", position:"relative" }}
        >
          <div style={{ position:"absolute", right:"-10px", top:"-10px", width:"100px", height:"100px", borderRadius:"50%", background:"radial-gradient(circle,rgba(123,97,255,0.2),transparent 70%)", pointerEvents:"none" }}/>
          <div style={{ width:"48px", height:"48px", borderRadius:"14px", background:"rgba(123,97,255,0.18)", border:"1px solid rgba(123,97,255,0.35)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <Dumbbell size={22} color="#7B61FF"/>
          </div>
          <div style={{ flex:1 }}>
            <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"17px", fontWeight:800, color:"#F2F2F7", lineHeight:1.1 }}>Guía de Máquinas</p>
            <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"13px", fontWeight:600, color:"#7B61FF", lineHeight:1.1 }}>y Ejercicios</p>
            <p style={{ fontSize:"11px", color:"#8E8EA0", marginTop:"3px" }}>6 máquinas · Instrucciones y tips</p>
          </div>
          <ChevronRight size={20} color="#7B61FF"/>
        </button>
      </div>

      {/* 3 — Progreso Semanal */}
      <div style={{ padding:"14px 24px 0" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"10px" }}>
          <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"17px", fontWeight:800, color:"#F2F2F7", textTransform:"uppercase" }}>Progreso Semanal</span>
          <TrendingUp size={15} color="#FF4D00"/>
        </div>
        <div style={{ background:"#141420", borderRadius:"16px", border:"1px solid rgba(255,255,255,0.06)", padding:"14px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", gap:"6px" }}>
            {days.map(({day,done,active}:any)=>(
              <div key={day} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:"5px" }}>
                <div style={{ height:done?"36px":active?"28px":"18px", width:"100%", borderRadius:"5px", background:done?"linear-gradient(180deg,#FF4D00,#FF7A00)":active?"rgba(255,77,0,0.25)":"rgba(255,255,255,0.05)", border:active?"1px solid rgba(255,77,0,0.5)":"none" }}/>
                <span style={{ fontSize:"11px", fontWeight:700, color:active?"#FF4D00":done?"#F2F2F7":"#8E8EA0", fontFamily:"'Barlow Condensed',sans-serif" }}>{day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4 — Stats cards (above Accesos Rápidos) */}
      <div style={{ display:"flex", gap:"10px", padding:"12px 24px 0" }}>
        {[{label:"Sesiones",value:"24",icon:Dumbbell,color:"#FF4D00"},{label:"Calorías",value:"18.4k",icon:Zap,color:"#FFD60A"},{label:"Logros",value:"9",icon:Trophy,color:"#7B61FF"}].map(({label,value,icon:Icon,color})=>(
          <div key={label} style={{ flex:1, background:"#141420", borderRadius:"14px", border:"1px solid rgba(255,255,255,0.06)", padding:"12px 8px", display:"flex", flexDirection:"column", alignItems:"center", gap:"4px" }}>
            <Icon size={16} color={color}/><span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"22px", fontWeight:800, color:"#F2F2F7", lineHeight:1 }}>{value}</span><span style={{ fontSize:"10px", color:"#8E8EA0" }}>{label}</span>
          </div>
        ))}
      </div>

      {/* 5 — Accesos Rápidos */}
      <div style={{ padding:"12px 24px 0" }}>
        <p style={{ fontSize:"11px", color:"#8E8EA0", fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:"10px" }}>Accesos Rápidos</p>
        <div style={{ display:"flex", gap:"8px" }}>
          {[{label:"Escanear QR",r:"qr" as Route,icon:QrCode,color:"#FF4D00"},{label:"Logros & Retos",r:"gamification" as Route,icon:Trophy,color:"#FFD60A"},{label:"Coach IA",r:"chatbot" as Route,icon:Bot,color:"#7B61FF"}].map(({label,r,icon:Icon,color})=>(
            <button key={r} onClick={()=>nav(r)} style={{ flex:1, padding:"12px 6px", borderRadius:"14px", background:"#141420", border:"1px solid rgba(255,255,255,0.07)", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:"6px" }}>
              <Icon size={18} color={color}/><span style={{ fontSize:"10px", color:"#8E8EA0", fontWeight:600, textAlign:"center" }}>{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div style={{ height:"100px" }}/>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   RUTINAS (was Planes) — full-width category list
═══════════════════════════════════════════════════════════ */
const CATEGORIES = [
  { label:"Mis Planes",    emoji:"📋", desc:"Rutinas creadas por ti o con IA",  color:"#FF4D00" },
  { label:"Tren Superior", emoji:"💪", desc:"Pecho, Espalda, Hombros, Brazos",  color:"#7B61FF" },
  { label:"Piernas",       emoji:"🦵", desc:"Cuádriceps, Glúteos, Isquios",     color:"#FF6B35" },
  { label:"Core",          emoji:"⚡", desc:"Abdomen, Lumbar, Estabilidad",      color:"#FFD60A" },
  { label:"Cardio",        emoji:"🏃", desc:"HIIT, Resistencia, Quema de grasa", color:"#30D158" },
  { label:"Full Body",     emoji:"🔥", desc:"Entrenamiento integral completo",   color:"#FF4D00" },
];

function PlanesScreen({ nav, onSelectCategory, savedPlans }: { nav:(r:Route)=>void; onSelectCategory:(c:string)=>void; savedPlans: SavedPlan[] }) {
  return (
    <div style={{ flex:1, overflowY:"auto", scrollbarWidth:"none" }}>
      <div style={{ padding:"16px 24px 14px" }}>
        <h1 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"28px", fontWeight:800, color:"#F2F2F7" }}>Rutinas</h1>
        <p style={{ fontSize:"12px", color:"#8E8EA0", marginTop:"2px" }}>Selecciona un grupo para explorar programas</p>
      </div>

      {/* Category cards — full width stacked */}
      <div style={{ padding:"0 24px", display:"flex", flexDirection:"column", gap:"10px" }}>
        {CATEGORIES.map(({ label, emoji, desc, color }) => {
          const count = label === "Mis Planes" ? savedPlans.length : null;
          return (
            <button
              key={label}
              onClick={()=>{ onSelectCategory(label); nav("rutina-categoria"); }}
              style={{ width:"100%", display:"flex", alignItems:"center", gap:"16px", padding:"16px 18px", borderRadius:"18px", background:"#141420", border:`1px solid ${label==="Mis Planes"&&count&&count>0?"rgba(255,77,0,0.25)":"rgba(255,255,255,0.07)"}`, cursor:"pointer", textAlign:"left" }}
            >
              <div style={{ width:"48px", height:"48px", borderRadius:"16px", background:`${color}18`, border:`1px solid ${color}30`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:"22px" }}>{emoji}</div>
              <div style={{ flex:1 }}>
                <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"18px", fontWeight:800, color:"#F2F2F7", lineHeight:1 }}>{label}</p>
                <p style={{ fontSize:"11px", color:"#8E8EA0", marginTop:"4px" }}>{count !== null ? (count > 0 ? `${count} rutina${count !== 1?"s":""} guardada${count !== 1?"s":""}` : desc) : desc}</p>
              </div>
              {count !== null && count > 0 && <div style={{ background:"#FF4D00", borderRadius:"10px", padding:"2px 8px", fontFamily:"'Barlow Condensed',sans-serif", fontSize:"13px", fontWeight:800, color:"#fff" }}>{count}</div>}
              <ChevronRight size={18} color="#3A3A50"/>
            </button>
          );
        })}
      </div>

      {/* Create plan buttons */}
      <div style={{ padding:"18px 24px 8px" }}>
        <div style={{ height:"1px", background:"rgba(255,255,255,0.06)", marginBottom:"16px" }}/>
        <p style={{ fontSize:"11px", color:"#8E8EA0", fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:"10px" }}>Crear nueva rutina</p>
        <div style={{ display:"flex", gap:"10px" }}>
          <button onClick={()=>nav("plan-manual")} style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:"7px", padding:"13px 8px", borderRadius:"14px", background:"#141420", border:"1px solid rgba(255,255,255,0.1)", cursor:"pointer" }}>
            <Wrench size={15} color="#8E8EA0"/>
            <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"13px", fontWeight:700, color:"#C4C4D0" }}>Plan Manual</span>
          </button>
          <button onClick={()=>nav("plan-ia")} style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:"7px", padding:"13px 8px", borderRadius:"14px", background:"linear-gradient(90deg,#7B61FF,#FF4D00)", border:"none", cursor:"pointer", boxShadow:"0 4px 20px rgba(123,97,255,0.4)" }}>
            <Sparkles size={15} color="#fff"/>
            <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"13px", fontWeight:700, color:"#fff" }}>Plan con IA</span>
          </button>
        </div>
      </div>
      <div style={{ height:"100px" }}/>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   RUTINA CATEGORIA — difficulty / program picker
═══════════════════════════════════════════════════════════ */
const LEVEL_COLORS: Record<string,string> = { Principiante:"#30D158", Intermedio:"#FFD60A", Avanzado:"#FF4D00", Personalizado:"#7B61FF" };

function RutinaCategoriaScreen({ nav, category, onSelectProgram, savedPlans, onSelectSavedPlan }: { nav:(r:Route)=>void; category:string; onSelectProgram:(p:string)=>void; savedPlans: SavedPlan[]; onSelectSavedPlan:(p:SavedPlan)=>void }) {
  const isMisPlanes = category === "Mis Planes";
  const programs = isMisPlanes
    ? savedPlans.map(p => ({ name:p.name, level:p.type==="ia"?"IA":"Personalizado", days:p.days, color:p.type==="ia"?"#7B61FF":"#FF4D00", desc:p.type==="ia"?`IA · ${p.muscle??""} · ${p.freq??""} días/sem`:"Rutina personalizada creada manualmente", _saved:p }))
    : (RUTINAS_DATA[category] ?? []).map(p=>({...p, _saved:undefined as undefined}));

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
      <BackHeader title={category} subtitle="Selecciona tu programa" onBack={()=>nav("planes")}/>
      <div style={{ flex:1, overflowY:"auto", scrollbarWidth:"none", padding:"16px 24px 0" }}>
        <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
          {programs.length === 0 && (
            <div style={{ textAlign:"center", padding:"40px 20px", color:"#8E8EA0" }}>
              <div style={{ fontSize:"36px", marginBottom:"12px" }}>📋</div>
              <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"18px", fontWeight:700, color:"#C4C4D0", marginBottom:"6px" }}>Sin rutinas guardadas</p>
              <p style={{ fontSize:"12px" }}>Crea un plan manual o con IA desde la sección Rutinas</p>
            </div>
          )}
          {programs.map((prog) => {
            const lc = LEVEL_COLORS[prog.level] ?? "#FF4D00";
            return (
              <button
                key={prog.name}
                onClick={()=>{ if(prog._saved){ onSelectSavedPlan(prog._saved); nav("mis-plan-detalle"); } else { onSelectProgram(prog.name); nav("rutina-detalle"); } }}
                style={{ width:"100%", textAlign:"left", borderRadius:"20px", background:"#141420", border:`1px solid rgba(255,255,255,0.07)`, cursor:"pointer", overflow:"hidden", padding:0 }}
              >
                {/* Color accent bar */}
                <div style={{ height:"4px", background:`linear-gradient(90deg,${lc},${lc}88)` }}/>
                <div style={{ padding:"16px 18px" }}>
                  <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:"8px" }}>
                    <div style={{ flex:1 }}>
                      <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"19px", fontWeight:800, color:"#F2F2F7", lineHeight:1.1 }}>{prog.name}</p>
                      <p style={{ fontSize:"11px", color:"#8E8EA0", marginTop:"4px" }}>{prog.desc}</p>
                    </div>
                    <span style={{ fontSize:"11px", fontWeight:700, color:lc, background:`${lc}18`, border:`1px solid ${lc}33`, borderRadius:"8px", padding:"3px 10px", marginLeft:"12px", whiteSpace:"nowrap" }}>{prog.level}</span>
                  </div>
                  <div style={{ display:"flex", gap:"16px", paddingTop:"8px", borderTop:"1px solid rgba(255,255,255,0.05)" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:"5px" }}>
                      <Clock size={12} color="#8E8EA0"/>
                      <span style={{ fontSize:"11px", color:"#8E8EA0" }}>{prog.days} días</span>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:"5px" }}>
                      <Dumbbell size={12} color="#8E8EA0"/>
                      <span style={{ fontSize:"11px", color:"#8E8EA0" }}>5–6 días/semana</span>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:"5px" }}>
                      <ChevronRight size={12} color={lc}/>
                      <span style={{ fontSize:"11px", color:lc, fontWeight:600 }}>Ver programa</span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        <div style={{ height:"100px" }}/>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   RUTINA DETALLE — 4 weeks, all days visible, floating CTA
═══════════════════════════════════════════════════════════ */
function RutinaDetalleScreen({ nav, program, onStartWorkout }: { nav:(r:Route)=>void; program:string; onStartWorkout:(exs:PlanExercise[])=>void }) {
  const CURRENT_DAY = 3;
  const HAS_STARTED = true;
  const [expandedDay, setExpandedDay] = useState<number|null>(CURRENT_DAY);

  // Group days by week for section headers
  const semanas = [1,2,3,4].map(s => ({
    num: s,
    days: DIAS_PLAN.filter(d => d.dia >= (s-1)*7+1 && d.dia <= s*7),
  }));

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", position:"relative" }}>
      <BackHeader title={program} subtitle={`Semana ${Math.ceil(CURRENT_DAY/7)} · Día ${CURRENT_DAY} de ${DIAS_PLAN.length}`} onBack={()=>nav("rutina-categoria")}/>

      {/* Progress bar */}
      <div style={{ padding:"10px 24px 0", flexShrink:0 }}>
        <div style={{ height:"4px", background:"rgba(255,255,255,0.07)", borderRadius:"2px", overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${Math.round(((CURRENT_DAY-1)/DIAS_PLAN.length)*100)}%`, background:"linear-gradient(90deg,#FF4D00,#FF7A00)", borderRadius:"2px" }}/>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:"4px" }}>
          <span style={{ fontSize:"10px", color:"#8E8EA0" }}>{CURRENT_DAY-1} días completados</span>
          <span style={{ fontSize:"10px", color:"#FF4D00", fontWeight:600 }}>{Math.round(((CURRENT_DAY-1)/DIAS_PLAN.length)*100)}%</span>
        </div>
      </div>

      <div style={{ flex:1, overflowY:"auto", scrollbarWidth:"none", padding:"12px 24px 0" }}>
        {semanas.map(sem => (
          <div key={sem.num} style={{ marginBottom:"8px" }}>
            {/* Week header */}
            <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"8px", marginTop: sem.num > 1 ? "14px" : "0" }}>
              <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"12px", fontWeight:800, color:"#FF4D00", textTransform:"uppercase", letterSpacing:"0.1em" }}>
                Semana {sem.num}
              </span>
              <div style={{ flex:1, height:"1px", background:"rgba(255,77,0,0.2)" }}/>
              <span style={{ fontSize:"10px", color:"#8E8EA0" }}>{sem.days.filter(d=>d.tipo==="entrenamiento").length} entrenos</span>
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
              {sem.days.map((day) => {
                const isDone    = day.dia < CURRENT_DAY;
                const isCurrent = day.dia === CURRENT_DAY;
                const isFuture  = day.dia > CURRENT_DAY;
                const isExpanded = expandedDay === day.dia;
                const isRest    = day.tipo === "descanso";

                return (
                  <div key={day.dia} style={{ borderRadius:"16px", overflow:"hidden", border: isCurrent ? "1.5px solid rgba(255,77,0,0.5)" : "1px solid rgba(255,255,255,0.06)" }}>
                    {/* Day row — all days tappable */}
                    <button
                      onClick={()=>!isRest && setExpandedDay(isExpanded ? null : day.dia)}
                      style={{ width:"100%", display:"flex", alignItems:"center", gap:"12px", padding:"13px 14px", background: isCurrent ? "linear-gradient(135deg,#1a0800,#2d1200)" : isDone ? "#141420" : "#0F0F1A", cursor: isRest ? "default" : "pointer", textAlign:"left" }}
                    >
                      {/* Status dot */}
                      <div style={{ width:"34px", height:"34px", borderRadius:"50%", background: isCurrent ? "linear-gradient(135deg,#FF4D00,#FF7A00)" : isDone ? "rgba(48,209,88,0.15)" : isFuture ? "rgba(255,255,255,0.04)" : "transparent", border: isCurrent ? "none" : isDone ? "1.5px solid rgba(48,209,88,0.4)" : "1.5px solid rgba(255,255,255,0.08)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        {isDone
                          ? <CheckCircle2 size={16} color="#30D158"/>
                          : <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"13px", fontWeight:900, color: isCurrent ? "#fff" : "#8E8EA0" }}>{day.dia}</span>
                        }
                      </div>

                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:"5px", flexWrap:"wrap" }}>
                          <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"16px", fontWeight:800, color: isCurrent ? "#F2F2F7" : isDone ? "#C4C4D0" : "#8E8EA0" }}>
                            Día {day.dia}
                          </span>
                          {isCurrent && <span style={{ fontSize:"8px", fontWeight:700, color:"#FF4D00", background:"rgba(255,77,0,0.15)", padding:"2px 6px", borderRadius:"5px", textTransform:"uppercase" }}>Actual</span>}
                          {isDone    && <span style={{ fontSize:"8px", fontWeight:700, color:"#30D158", background:"rgba(48,209,88,0.1)", padding:"2px 6px", borderRadius:"5px" }}>✓ Hecho</span>}
                          {isFuture  && <span style={{ fontSize:"8px", color:"#3A3A50", fontWeight:600 }}>Próximo</span>}
                        </div>
                        <p style={{ fontSize:"10px", color: isCurrent ? "#FF6B35" : isDone ? "#8E8EA0" : "#5A5A70", marginTop:"2px", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                          {isRest ? "🛌 Descanso — sin ejercicios" : day.focus}
                        </p>
                      </div>

                      {!isRest && (
                        <div style={{ display:"flex", alignItems:"center", gap:"6px", flexShrink:0 }}>
                          {!isFuture && <span style={{ fontSize:"9px", color:"#8E8EA0" }}>{day.dur}</span>}
                          {isExpanded ? <ChevronUp size={14} color="#8E8EA0"/> : <ChevronDown size={14} color={isFuture?"#3A3A50":"#8E8EA0"}/>}
                        </div>
                      )}
                    </button>

                    {/* Expanded: exercise list (available for all non-rest days) */}
                    {isExpanded && !isRest && (
                      <div style={{ background:"#0B0B14", borderTop:"1px solid rgba(255,255,255,0.04)" }}>
                        {/* Stats */}
                        <div style={{ display:"flex", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                          {[{label:"Duración",value:day.dur},{label:"Kcal",value:day.kcal},{label:"Ejercicios",value:`${day.ejercicios.length}`}].map(({label,value},i)=>(
                            <div key={label} style={{ flex:1, padding:"9px 8px", textAlign:"center", borderRight: i<2 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                              <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"15px", fontWeight:800, color: isFuture ? "#5A5A70" : "#FF4D00" }}>{value}</p>
                              <p style={{ fontSize:"9px", color:"#5A5A70", marginTop:"1px" }}>{label}</p>
                            </div>
                          ))}
                        </div>
                        {/* Exercises */}
                        {day.ejercicios.map((ex,i)=>(
                          <div key={i} style={{ display:"flex", alignItems:"center", gap:"10px", padding:"9px 14px", borderBottom: i<day.ejercicios.length-1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                            <div style={{ width:"38px", height:"38px", borderRadius:"10px", background: isFuture ? "rgba(255,255,255,0.03)" : "rgba(255,77,0,0.08)", border:`1px solid ${isFuture?"rgba(255,255,255,0.06)":"rgba(255,77,0,0.12)"}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                              <Dumbbell size={15} color={isFuture?"#3A3A50":"rgba(255,77,0,0.5)"}/>
                            </div>
                            <div style={{ flex:1 }}>
                              <p style={{ fontSize:"12px", fontWeight:700, color: isFuture ? "#8E8EA0" : "#F2F2F7", lineHeight:1 }}>{ex.nombre}</p>
                              <p style={{ fontSize:"9px", color:"#5A5A70", marginTop:"2px" }}>{ex.desc}</p>
                            </div>
                            <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"13px", fontWeight:800, color: isFuture?"#5A5A70":"#FF4D00", flexShrink:0 }}>{ex.series}×{ex.reps}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        <div style={{ height:"110px" }}/>
      </div>

      {/* Floating CTA — bottom right */}
      <div style={{ position:"absolute", bottom:"16px", right:"16px", zIndex:10 }}>
        <button
          onClick={()=>{
            const curDayObj = DIAS_PLAN.find(d=>d.dia===CURRENT_DAY);
            const exs: PlanExercise[] = (curDayObj?.ejercicios ?? []).map(e=>({ name:e.nombre, series:e.series, reps:e.reps, rest:"60" }));
            onStartWorkout(exs.length > 0 ? exs : DEFAULT_WORKOUT);
          }}
          style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"12px 20px", borderRadius:"20px", background:"linear-gradient(135deg,#FF4D00,#FF7A00)", border:"none", cursor:"pointer", boxShadow:"0 6px 28px rgba(255,77,0,0.55)", minWidth:"120px" }}
        >
          <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"18px", fontWeight:900, color:"#fff", textTransform:"uppercase", lineHeight:1 }}>
            {HAS_STARTED ? "Continuar" : "Comenzar"}
          </span>
          <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"12px", fontWeight:700, color:"rgba(255,255,255,0.75)", marginTop:"2px" }}>
            Día {CURRENT_DAY}
          </span>
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   QR SCAN — no flash btn, square scanner, btn below
═══════════════════════════════════════════════════════════ */
function QRScanScreen({ nav, onScan }: { nav:(r:Route)=>void; onScan:(idx:number)=>void }) {
  const [scanning,    setScanning]    = useState(false);
  const [found,       setFound]       = useState(false);
  const [detectedIdx, setDetectedIdx] = useState<number|null>(null);

  function handleScan() {
    if (found || scanning) return;
    setScanning(true);
    setTimeout(() => {
      const idx = Math.floor(Math.random() * MACHINES.length);
      setDetectedIdx(idx);
      setScanning(false);
      setFound(true);
    }, 2200);
  }

  useEffect(() => {
    if (found && detectedIdx !== null) {
      onScan(detectedIdx);
      const t = setTimeout(() => nav("maquina-detalle"), 800);
      return () => clearTimeout(t);
    }
  }, [found]);

  const borderColor = found ? "#30D158" : scanning ? "#FF4D00" : "rgba(255,255,255,0.25)";

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
      {/* Header — no flash button */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:"16px 24px 8px", flexShrink:0 }}>
        <div style={{ textAlign:"center" }}>
          <p style={{ fontSize:"11px", color:"#8E8EA0", fontWeight:600, textTransform:"uppercase" }}>Imperium Cross</p>
          <h2 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"22px", fontWeight:800, color:"#F2F2F7" }}>Autoasistencia en Sala</h2>
        </div>
      </div>

      <p style={{ textAlign:"center", fontSize:"12px", color:"#8E8EA0", padding:"0 32px 16px", flexShrink:0, lineHeight:1.6 }}>
        Escanea el QR del equipo para ver la guía de<br/>uso correcta, músculos implicados y tips de seguridad
      </p>

      <div style={{ flex:1, overflowY:"auto", scrollbarWidth:"none", display:"flex", flexDirection:"column", alignItems:"center", padding:"0 24px" }}>

        {/* SQUARE scanner viewport */}
        <div style={{ width:"240px", height:"240px", position:"relative", borderRadius:"20px", overflow:"hidden", border:`2px solid ${borderColor}`, background:"#090910", transition:"border-color 0.3s", flexShrink:0 }}>
          {/* Scan line */}
          {scanning && (
            <div style={{ position:"absolute", left:0, right:0, height:"2px", background:"linear-gradient(90deg,transparent,rgba(255,77,0,0.8),rgba(255,120,0,1),rgba(255,77,0,0.8),transparent)", boxShadow:"0 0 12px rgba(255,77,0,0.6)", animation:"scanBeam 1.2s ease-in-out infinite" }}/>
          )}
          {/* Corner marks */}
          {(["top-left","top-right","bottom-left","bottom-right"] as const).map(pos => {
            const isT = pos.includes("top"); const isL = pos.includes("left");
            return <div key={pos} style={{ position:"absolute", top:isT?"10px":undefined, bottom:!isT?"10px":undefined, left:isL?"10px":undefined, right:!isL?"10px":undefined, width:"22px", height:"22px", borderTop:isT?`3px solid ${borderColor}`:"none", borderBottom:!isT?`3px solid ${borderColor}`:"none", borderLeft:isL?`3px solid ${borderColor}`:"none", borderRight:!isL?`3px solid ${borderColor}`:"none", borderRadius:isT&&isL?"6px 0 0 0":isT&&!isL?"0 6px 0 0":!isT&&isL?"0 0 0 6px":"0 0 6px 0" }}/>;
          })}
          {/* CRT lines overlay */}
          <div style={{ position:"absolute", inset:0, backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(255,255,255,0.012) 3px,rgba(255,255,255,0.012) 4px)" }}/>
          {/* Center content */}
          <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"8px" }}>
            {found
              ? <CheckCircle2 size={52} color="#30D158" style={{ filter:"drop-shadow(0 0 12px rgba(48,209,88,0.8))" }}/>
              : <ImageIcon size={28} color="rgba(255,255,255,0.12)"/>
            }
            {!found && (
              <p style={{ fontSize:"10px", color:"rgba(255,255,255,0.2)", textAlign:"center", padding:"0 16px" }}>
                {scanning ? "Buscando QR..." : "MARCADOR DE POSICIÓN: Visor de cámara"}
              </p>
            )}
            {found && detectedIdx !== null && (
              <div style={{ textAlign:"center", padding:"0 8px" }}>
                <p style={{ fontSize:"12px", color:"#30D158", fontWeight:700 }}>¡QR detectado!</p>
                <p style={{ fontSize:"10px", color:"#8E8EA0", marginTop:"3px" }}>{MACHINES[detectedIdx].nameEs}</p>
              </div>
            )}
          </div>
        </div>

        {/* Scan state label */}
        <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"16px", fontWeight:700, color: found?"#30D158":scanning?"#FF6B35":"#8E8EA0", marginTop:"14px", marginBottom:"10px" }}>
          {found ? "Redirigiendo..." : scanning ? "Escaneando código..." : "Apunta al QR del equipo"}
        </p>

        {/* Scan button — below, smaller */}
        {!found && (
          <button
            onClick={handleScan}
            disabled={scanning}
            style={{ display:"flex", alignItems:"center", gap:"8px", padding:"11px 28px", borderRadius:"14px", background:scanning?"rgba(255,77,0,0.15)":"linear-gradient(90deg,#FF4D00,#FF7A00)", border:scanning?"1px solid rgba(255,77,0,0.3)":"none", cursor:scanning?"default":"pointer", boxShadow:scanning?"none":"0 4px 16px rgba(255,77,0,0.4)" }}
          >
            <QrCode size={16} color={scanning?"#FF6B35":"#fff"}/>
            <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"15px", fontWeight:800, color:scanning?"#FF6B35":"#fff", textTransform:"uppercase" }}>
              {scanning ? "Escaneando..." : "Iniciar Escaneo"}
            </span>
          </button>
        )}

        {/* Info card */}
        <div style={{ width:"100%", marginTop:"20px", background:"#141420", borderRadius:"16px", border:"1px solid rgba(255,255,255,0.06)", padding:"14px 16px" }}>
          <p style={{ fontSize:"12px", color:"#C4C4D0", fontWeight:600, marginBottom:"6px" }}>¿Cómo funciona?</p>
          {["Apunta la cámara al código QR del equipo","Obtendrás la guía de uso y músculos trabajados","Verifica los tips de seguridad antes de comenzar"].map((tip,i)=>(
            <div key={i} style={{ display:"flex", gap:"8px", alignItems:"flex-start", marginBottom:"5px" }}>
              <span style={{ width:"16px", height:"16px", borderRadius:"50%", background:"rgba(255,77,0,0.15)", border:"1px solid rgba(255,77,0,0.25)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:"8px", color:"#FF4D00", fontWeight:800 }}>{i+1}</span>
              <p style={{ fontSize:"11px", color:"#8E8EA0", lineHeight:1.4 }}>{tip}</p>
            </div>
          ))}
        </div>
        <div style={{ height:"100px" }}/>
      </div>
      <style>{`@keyframes scanBeam{0%,100%{top:8%}50%{top:88%}}`}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MACHINES DATA
═══════════════════════════════════════════════════════════ */
type MachineData = {
  id: number; name: string; nameEs: string; num: string;
  img: string; gif?: string;
  desc: string; equipment: string;
  muscles: string[]; primaryMuscle: string;
  steps: { title: string; desc: string }[];
  tips: string[];
  defaultExercise: PlanExercise;
};

const MACHINES: MachineData[] = [
  {
    id:1, name:"Chest Press Machine", nameEs:"Prensa de Pecho en Máquina", num:"07",
    img: chestPressImg as string, gif: chestPressGif as string,
    desc:"Un ejercicio de empuje ideal para principiantes que buscan desarrollar la fuerza del torso con gran estabilidad, enfocándose en el desarrollo de la masa muscular del pecho sin el riesgo de perder el equilibrio de una barra libre.",
    equipment:"Máquina de Chest Press (Prensa de Pecho)",
    muscles:["Pectoral Mayor","Deltoides Anterior","Tríceps"], primaryMuscle:"Pectoral Mayor",
    steps:[
      { title:"Ajusta el asiento", desc:"Regula la altura para que los agarres queden a la altura de la mitad del pecho." },
      { title:"Postura en el respaldo", desc:"Apoya firmemente la espalda y la cabeza en el respaldo, coloca los pies planos en el suelo." },
      { title:"Fase de empuje", desc:"Sujeta los agarres con las palmas hacia abajo y empuja el peso hacia adelante extendiendo los brazos por completo (sin bloquear los codos)." },
      { title:"Fase excéntrica", desc:"Regresa lentamente controlando el peso hasta que sientas el estiramiento en el pecho e inhala." },
    ],
    tips:["Evita despegar la espalda o los hombros del respaldo al empujar el peso.","No dejes caer las placas de golpe en la fase de regreso.","Realiza de 8–12 repeticiones por serie para hipertrofia.","Mantén el núcleo activo durante toda la ejecución."],
    defaultExercise:{ name:"Prensa de Pecho en Máquina", series:"3", reps:"12", rest:"60" },
  },
  {
    id:2, name:"Assisted Triceps Dips", nameEs:"Fondos de Tríceps Asistidos", num:"14",
    img: tricepsDipsImg as string, gif: tricepsDipsGif as string,
    desc:"Excelente ejercicio compuesto que utiliza un sistema de contrapeso para reducir el peso corporal del usuario, permitiendo ganar fuerza en los brazos y hombros de forma controlada antes de pasar a los fondos libres.",
    equipment:"Máquina de Fondos Asistidos (Gravitón)",
    muscles:["Tríceps Braquial","Deltoides Anterior","Pectoral Mayor"], primaryMuscle:"Tríceps Braquial",
    steps:[
      { title:"Selecciona la asistencia", desc:"Elige el peso de asistencia (a mayor peso seleccionado, más fácil será el ejercicio) y colócate de rodillas o de pie sobre la plataforma móvil." },
      { title:"Posición inicial", desc:"Sujeta las barras paralelas con agarre neutro (palmas hacia adentro), mantén los brazos extendidos y el abdomen contraído." },
      { title:"Fase de descenso", desc:"Baja el cuerpo lentamente flexionando los codos hacia atrás, manteniéndolos cerca del torso, hasta que tus brazos formen un ángulo de 90 grados." },
      { title:"Fase de empuje", desc:"Presiona con las palmas hacia abajo para extender los brazos y regresar a la posición inicial sin bloquear los codos al subir." },
    ],
    tips:["Mantén los codos apuntando hacia atrás y no hacia los lados para no estresar el hombro.","Evita inclinarte demasiado hacia adelante para que el esfuerzo no se vaya al pecho.","Controla el descenso — no bajes de golpe.","Escoge una asistencia que te permita completar 10–12 reps con buena forma."],
    defaultExercise:{ name:"Fondos de Tríceps Asistidos", series:"3", reps:"10", rest:"60" },
  },
  {
    id:3, name:"Leg Extension", nameEs:"Extensión de Piernas", num:"11",
    img: legExtImg as string, gif: legExtGif as string,
    desc:"Un ejercicio de aislamiento diseñado exclusivamente para trabajar la parte frontal del muslo. Ayuda a definir la musculatura de las piernas, corregir desbalances y fortalecer los tejidos que dan estabilidad a la rodilla.",
    equipment:"Máquina de Leg Extension (Extensión de Piernas)",
    muscles:["Cuádriceps (Recto Femoral)","Vasto Lateral","Vasto Medial"], primaryMuscle:"Cuádriceps",
    steps:[
      { title:"Ajusta el rodillo", desc:"Siéntate apoyando completamente la espalda y ajusta el rodillo para que descanse justo sobre la parte baja de tus tobillos." },
      { title:"Alinea las rodillas", desc:"Alinea tus rodillas con el eje de rotación de la máquina y sujeta con fuerza los mangos laterales para fijar la cadera." },
      { title:"Extensión", desc:"Exhala y contrae los cuádriceps para levantar el rodillo extendiendo las piernas de forma frontal." },
      { title:"Regreso controlado", desc:"Pausa un segundo arriba apretando el músculo y regresa de manera pausada a la posición inicial." },
    ],
    tips:["Evita levantar los glúteos o la cadera del asiento al hacer la fuerza.","No bloquees ni hiperextiendas las rodillas de forma brusca en la posición más alta.","Si tienes problemas de rodilla, trabaja en rango parcial primero.","Usa un peso que permita controlar el movimiento en todo momento."],
    defaultExercise:{ name:"Extensión de Piernas", series:"3", reps:"15", rest:"60" },
  },
  {
    id:4, name:"Face Pull", nameEs:"Jalón al Rostro", num:"03",
    img: facePullImg as string, gif: facePullGif as string,
    desc:"Ejercicio de tracción con polea altamente efectivo para corregir la postura corporal, fortalecer la espalda alta y mejorar la salud articular de los hombros, contrarrestando la rigidez del día a día.",
    equipment:"Máquina de Polea Alta con accesorio de cuerda",
    muscles:["Deltoides Posterior","Trapecios","Romboides"], primaryMuscle:"Deltoides Posterior",
    steps:[
      { title:"Configura la polea", desc:"Coloca la polea a la altura de tus ojos o el pecho y sujeta los extremos de la cuerda con las palmas mirando hacia abajo." },
      { title:"Posición de partida", desc:"Da unos pasos hacia atrás para tensar el cable, sepárate a la anchura de los hombros y flexiona ligeramente las rodillas." },
      { title:"Jalón hacia el rostro", desc:"Jala la cuerda directamente hacia tu rostro (dirección a la nariz o frente), separando las manos y manteniendo los codos elevados hacia los lados." },
      { title:"Regreso controlado", desc:"Siente la contracción en la espalda alta, aguanta un instante y regresa estirando los brazos con lentitud." },
    ],
    tips:["Mantén los codos altos (a la altura de los hombros) durante todo el trayecto.","No utilices el impulso de tu espalda baja para mover el peso; el torso debe quedarse firme.","Separa bien las manos al final del jalón para activar el deltoides posterior.","Usa cargas moderadas — la calidad del movimiento es más importante que el peso."],
    defaultExercise:{ name:"Face Pull", series:"3", reps:"12", rest:"45" },
  },
  {
    id:5, name:"Treadmill", nameEs:"Cinta de Correr", num:"01",
    img: treadmillImg as string, gif: treadmillGif as string,
    desc:"Máquina cardiovascular por excelencia que permite caminar, trotar o correr en un entorno controlado. Es perfecta para mejorar la resistencia aeróbica, la salud del corazón y optimizar la quema de calorías.",
    equipment:"Caminadora / Cinta de Correr",
    muscles:["Sistema Cardiovascular","Cuádriceps","Glúteos","Pantorrillas"], primaryMuscle:"Sistema Cardiovascular",
    steps:[
      { title:"Coloca la llave de seguridad", desc:"Súbete con la cinta detenida y colócate la pinza de la llave de seguridad en la ropa antes de encender." },
      { title:"Calentamiento", desc:"Enciende la caminadora e inicia con una caminata suave de 3 a 5 minutos para calentar las articulaciones." },
      { title:"Configura velocidad e inclinación", desc:"Ajusta la velocidad y la inclinación según tu objetivo (pérdida de grasa, intervalos o resistencia)." },
      { title:"Postura y enfriamiento", desc:"Mantén la vista al frente, balancea los brazos de forma natural y pisa con la parte media del pie. Al terminar, reduce el ritmo gradualmente antes de parar." },
    ],
    tips:["No te apoyes ni te sostengas de las barandas mientras trotas — reduce la efectividad y deforma la postura.","No mires hacia tus pies para evitar mareos o caídas.","Hidratate antes, durante y después de la sesión cardiovascular.","Para pérdida de grasa: 30–45 min a intensidad moderada (zona 2)."],
    defaultExercise:{ name:"Cinta de Correr", series:"1", reps:"45s", rest:"0" },
  },
  {
    id:6, name:"Incline Chest Press Machine", nameEs:"Prensa de Pecho Inclinada", num:"08",
    img: inclineChestImg as string, gif: inclineChestGif as string,
    desc:"Variante de la prensa tradicional guiada que transfiere el esfuerzo hacia la zona alta del pecho, ayudando a construir fuerza estructural y volumen estético en la sección clavicular de manera segura.",
    equipment:"Máquina de Incline Chest Press (Prensa Inclinada)",
    muscles:["Pectoral Mayor — Porción Clavicular","Deltoides Anterior","Tríceps"], primaryMuscle:"Pecho Superior",
    steps:[
      { title:"Ajusta el asiento", desc:"Configura el asiento de modo que los agarres queden alineados con la parte superior de tu pecho." },
      { title:"Postura", desc:"Apoya los pies firmemente en el suelo y mantén los hombros hacia atrás pegados al respaldo." },
      { title:"Fase de empuje", desc:"Agarra las manijas firmemente y empuja hacia adelante y hacia arriba siguiendo la trayectoria inclinada de la máquina hasta estirar los brazos." },
      { title:"Fase excéntrica", desc:"Controla el descenso del peso sintiendo cómo se abren y estiran las fibras del pecho superior antes de repetir." },
    ],
    tips:["Mantén los codos en un ángulo de 45° respecto al cuerpo para proteger los rotadores del hombro.","Evita arquear la espalda lumbar exageradamente para empujar la carga.","Enfócate en sentir el pecho superior — es un músculo difícil de aislar.","Combina con el chest press plano para desarrollar el pecho de forma completa."],
    defaultExercise:{ name:"Prensa de Pecho Inclinada", series:"3", reps:"10", rest:"60" },
  },
];

/* ═══════════════════════════════════════════════════════════
   GUÍA DE MÁQUINAS
═══════════════════════════════════════════════════════════ */
function GuiaMaquinasScreen({ nav, onSelectMachine }: { nav:(r:Route)=>void; onSelectMachine:(idx:number)=>void }) {
  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
      <BackHeader title="Guía de Máquinas y Ejercicios" subtitle="Selecciona un ejercicio para ver la guía completa" onBack={()=>nav("inicio")}/>
      <div style={{ flex:1, overflowY:"auto", scrollbarWidth:"none", padding:"12px 24px 0" }}>
        <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
          {MACHINES.map((m,i)=>(
            <button
              key={m.id}
              onClick={()=>{ onSelectMachine(i); nav("maquina-detalle"); }}
              style={{ display:"flex", alignItems:"center", gap:"14px", background:"#141420", borderRadius:"18px", border:"1px solid rgba(255,255,255,0.07)", padding:"0 0 0 16px", cursor:"pointer", textAlign:"left", overflow:"hidden", minHeight:"92px" }}
            >
              <div style={{ flex:1 }}>
                <span style={{ fontSize:"10px", color:"#8E8EA0", fontWeight:600 }}>{m.primaryMuscle}</span>
                <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"17px", fontWeight:800, color:"#F2F2F7", lineHeight:1.1, marginTop:"3px" }}>{m.nameEs}</p>
                <p style={{ fontSize:"10px", color:"#8E8EA0", marginTop:"3px" }}>{m.name}</p>
              </div>
              <div style={{ width:"110px", height:"92px", flexShrink:0, overflow:"hidden", borderRadius:"0 18px 18px 0", background:"#1C1C2A", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <ImageWithFallback
                  src={m.img}
                  alt={m.nameEs}
                  style={{ width:"90%", height:"90%", objectFit:"contain" }}
                />
              </div>
            </button>
          ))}
        </div>
        <div style={{ height:"100px" }}/>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAQUINA DETALLE — after QR scan or guide selection
═══════════════════════════════════════════════════════════ */
function MaquinaDetalleScreen({ nav, machine, fromGuide, onStartSingle }: { nav:(r:Route)=>void; machine:MachineData; fromGuide?:boolean; onStartSingle:(ex:PlanExercise)=>void }) {
  const [playing, setPlaying] = useState(false);

  const defEx = machine.defaultExercise;
  const defIsTime = /\d+\s*(s|seg|min)/i.test(defEx.reps);
  const defTimeSec = defIsTime ? (parseInt(defEx.reps) || 45) : 45;

  const [configMode,   setConfigMode]   = useState<"reps"|"time">(defIsTime ? "time" : "reps");
  const [configSeries, setConfigSeries] = useState(parseInt(defEx.series) || 3);
  const [configReps,   setConfigReps]   = useState(defIsTime ? 12 : (parseInt(defEx.reps) || 12));
  const [configTime,   setConfigTime]   = useState(defTimeSec);

  const TIME_PRESETS = [20, 30, 45, 60, 90, 120];
  const REPS_PRESETS = [6, 8, 10, 12, 15, 20];

  function buildExercise(): PlanExercise {
    return {
      name: machine.nameEs,
      series: String(configSeries),
      reps: configMode === "time" ? `${configTime}s` : String(configReps),
      rest: defEx.rest,
    };
  }

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
      <BackHeader
        title={machine.nameEs}
        subtitle="Guía de uso · Músculos implicados · Tips"
        onBack={()=>nav(fromGuide?"guia-maquinas":"qr")}
      />

      <div style={{ flex:1, overflowY:"auto", scrollbarWidth:"none" }}>
        {/* Machine image */}
        <div style={{ margin:"10px 48px 0", borderRadius:"20px", overflow:"hidden", background:"#1C1C2A", display:"flex", alignItems:"center", justifyContent:"center", height:"260px" }}>
          <ImageWithFallback
            src={machine.img}
            alt={machine.nameEs}
            style={{ width:"90%", height:"90%", objectFit:"contain" }}
          />
        </div>

        {/* Description */}
        <div style={{ padding:"14px 24px 0" }}>
          <p style={{ fontSize:"11px", color:"#8E8EA0", fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:"8px" }}>Descripción</p>
          <div style={{ background:"#141420", borderRadius:"14px", border:"1px solid rgba(255,255,255,0.06)", padding:"13px 14px" }}>
            <p style={{ fontSize:"12px", color:"#C4C4D0", lineHeight:1.6 }}>{machine.desc}</p>
          </div>
        </div>

        {/* Equipment */}
        <div style={{ padding:"12px 24px 0" }}>
          <p style={{ fontSize:"11px", color:"#8E8EA0", fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:"8px" }}>Equipamiento</p>
          <div style={{ display:"flex", alignItems:"center", gap:"10px", background:"#141420", borderRadius:"14px", border:"1px solid rgba(123,97,255,0.2)", padding:"11px 14px" }}>
            <div style={{ width:"32px", height:"32px", borderRadius:"10px", background:"rgba(123,97,255,0.15)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <Dumbbell size={16} color="#7B61FF"/>
            </div>
            <p style={{ fontSize:"13px", color:"#C4B8FF", fontWeight:600 }}>{machine.equipment}</p>
          </div>
        </div>

        {/* Muscles */}
        <div style={{ padding:"12px 24px 0" }}>
          <p style={{ fontSize:"11px", color:"#8E8EA0", fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:"8px" }}>Músculos Implicados</p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:"7px" }}>
            {machine.muscles.map((m,i)=>(
              <div key={m} style={{ padding:"5px 12px", background:i===0?"rgba(255,77,0,0.15)":"rgba(255,255,255,0.06)", borderRadius:"20px", border:i===0?"1px solid rgba(255,77,0,0.3)":"1px solid rgba(255,255,255,0.08)" }}>
                <span style={{ fontSize:"11px", color:i===0?"#FF6B35":"#C4C4D0", fontWeight:i===0?700:500 }}>{m}{i===0?" ★":""}</span>
              </div>
            ))}
          </div>
        </div>

        {/* How to use */}
        <div style={{ padding:"12px 24px 0" }}>
          <p style={{ fontSize:"11px", color:"#8E8EA0", fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:"10px" }}>Cómo Usarla</p>
          <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
            {machine.steps.map((s,i)=>(
              <div key={i} style={{ display:"flex", gap:"12px", background:"#141420", borderRadius:"14px", border:"1px solid rgba(255,255,255,0.06)", padding:"12px 14px" }}>
                <div style={{ width:"28px", height:"28px", borderRadius:"8px", background:"linear-gradient(135deg,#FF4D00,#FF7A00)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontFamily:"'Barlow Condensed',sans-serif", fontSize:"14px", fontWeight:900, color:"#fff" }}>{i+1}</div>
                <div>
                  <p style={{ fontSize:"13px", fontWeight:700, color:"#F2F2F7", marginBottom:"3px" }}>{s.title}</p>
                  <p style={{ fontSize:"11px", color:"#8E8EA0", lineHeight:1.5 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Safety tips */}
        <div style={{ padding:"12px 24px 0" }}>
          <p style={{ fontSize:"11px", color:"#8E8EA0", fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:"10px" }}>⚠️ Tips de Seguridad</p>
          <div style={{ background:"#141420", borderRadius:"16px", border:"1px solid rgba(255,214,10,0.15)", padding:"14px 16px" }}>
            {machine.tips.map((tip,i)=>(
              <div key={i} style={{ display:"flex", gap:"8px", alignItems:"flex-start", marginBottom:i<machine.tips.length-1?"10px":0 }}>
                <div style={{ width:"6px", height:"6px", borderRadius:"50%", background:"#FFD60A", marginTop:"5px", flexShrink:0 }}/>
                <p style={{ fontSize:"12px", color:"#C4C4D0", lineHeight:1.5 }}>{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Reproducir Ejemplo — azul compacto */}
        <div style={{ padding:"14px 24px 0" }}>
          <button
            onClick={()=>setPlaying(v=>!v)}
            style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px", padding:"11px 18px", borderRadius:"12px", background:playing?"rgba(67,140,255,0.25)":"rgba(67,140,255,0.15)", border:`1.5px solid ${playing?"rgba(67,140,255,0.6)":"rgba(67,140,255,0.35)"}`, cursor:"pointer", boxShadow:playing?"0 0 16px rgba(67,140,255,0.25)":"none" }}
          >
            <PlayCircle size={17} color="#438CFF"/>
            <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"15px", fontWeight:800, color:"#438CFF", textTransform:"uppercase", letterSpacing:"0.07em" }}>
              {playing ? "▶ Reproduciendo..." : "▶ Reproducir Ejemplo"}
            </span>
          </button>
          {playing && machine.gif && (
            <div style={{ marginTop:"10px", borderRadius:"16px", overflow:"hidden", background:"#fff" }}>
              <ImageWithFallback src={machine.gif} alt={`Demostración — ${machine.nameEs}`} style={{ width:"100%", objectFit:"contain" }}/>
            </div>
          )}
          {playing && !machine.gif && (
            <div style={{ marginTop:"10px", borderRadius:"14px", background:"#141420", border:"1px solid rgba(255,255,255,0.07)", padding:"20px", textAlign:"center" }}>
              <p style={{ fontSize:"13px", color:"#8E8EA0" }}>GIF de ejemplo próximamente disponible</p>
            </div>
          )}
        </div>

        {/* Configurador del ejercicio */}
        <div style={{ padding:"14px 24px 0" }}>
          <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"17px", fontWeight:900, color:"#F2F2F7", marginBottom:"2px" }}>Ejecutar ejercicio individualmente</p>
          <p style={{ fontSize:"11px", color:"#8E8EA0", fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:"10px" }}>Configurar</p>
          <div style={{ background:"#141420", borderRadius:"18px", border:"1px solid rgba(255,255,255,0.07)", padding:"14px 16px", display:"flex", flexDirection:"column", gap:"14px" }}>

            {/* Mode toggle */}
            <div style={{ display:"flex", background:"#0B0B12", borderRadius:"12px", padding:"3px", gap:"3px" }}>
              {([["reps","Por Repeticiones"],["time","Por Tiempo"]] as const).map(([m,label])=>{
                const isA = configMode===m;
                return (
                  <button key={m} onClick={()=>setConfigMode(m)} style={{ flex:1, padding:"8px 4px", borderRadius:"10px", border:"none", cursor:"pointer", background:isA?"linear-gradient(135deg,rgba(255,77,0,0.25),rgba(255,77,0,0.12))":"transparent", outline:isA?"1px solid rgba(255,77,0,0.4)":"none" }}>
                    <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"13px", fontWeight:800, color:isA?"#FF6B35":"#5A5A70" }}>{label}</span>
                  </button>
                );
              })}
            </div>

            {/* Series stepper */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <span style={{ fontSize:"13px", color:"#C4C4D0", fontWeight:600 }}>Series</span>
              <div style={{ display:"flex", alignItems:"center", gap:"0" }}>
                <button onClick={()=>setConfigSeries(v=>Math.max(1,v-1))} style={{ width:"34px", height:"34px", borderRadius:"10px 0 0 10px", background:"#0B0B12", border:"1px solid rgba(255,255,255,0.1)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Minus size={14} color="#8E8EA0"/>
                </button>
                <div style={{ width:"52px", height:"34px", background:"#0B0B12", borderTop:"1px solid rgba(255,77,0,0.3)", borderBottom:"1px solid rgba(255,77,0,0.3)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"20px", fontWeight:900, color:"#FF4D00" }}>{configSeries}</span>
                </div>
                <button onClick={()=>setConfigSeries(v=>Math.min(6,v+1))} style={{ width:"34px", height:"34px", borderRadius:"0 10px 10px 0", background:"#0B0B12", border:"1px solid rgba(255,255,255,0.1)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Plus size={14} color="#8E8EA0"/>
                </button>
              </div>
            </div>

            {/* Reps or Time selector */}
            {configMode === "reps" ? (
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <span style={{ fontSize:"13px", color:"#C4C4D0", fontWeight:600 }}>Repeticiones</span>
                <div style={{ display:"flex", alignItems:"center", gap:"0" }}>
                  <button onClick={()=>setConfigReps(v=>Math.max(1,v-1))} style={{ width:"34px", height:"34px", borderRadius:"10px 0 0 10px", background:"#0B0B12", border:"1px solid rgba(255,255,255,0.1)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <Minus size={14} color="#8E8EA0"/>
                  </button>
                  <div style={{ width:"52px", height:"34px", background:"#0B0B12", borderTop:"1px solid rgba(255,77,0,0.3)", borderBottom:"1px solid rgba(255,77,0,0.3)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"20px", fontWeight:900, color:"#FF4D00" }}>{configReps}</span>
                  </div>
                  <button onClick={()=>setConfigReps(v=>Math.min(50,v+1))} style={{ width:"34px", height:"34px", borderRadius:"0 10px 10px 0", background:"#0B0B12", border:"1px solid rgba(255,255,255,0.1)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <Plus size={14} color="#8E8EA0"/>
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"10px" }}>
                  <span style={{ fontSize:"13px", color:"#C4C4D0", fontWeight:600 }}>Tiempo</span>
                  <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"20px", fontWeight:900, color:"#FF4D00" }}>{configTime}s</span>
                </div>
                <div style={{ display:"flex", gap:"6px", flexWrap:"wrap" }}>
                  {TIME_PRESETS.map(t=>(
                    <button key={t} onClick={()=>setConfigTime(t)} style={{ flex:1, minWidth:"44px", padding:"7px 4px", borderRadius:"10px", background:configTime===t?"linear-gradient(135deg,rgba(255,77,0,0.25),rgba(255,77,0,0.1))":"#0B0B12", border:configTime===t?"1px solid rgba(255,77,0,0.45)":"1px solid rgba(255,255,255,0.08)", cursor:"pointer" }}>
                      <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"13px", fontWeight:800, color:configTime===t?"#FF6B35":"#8E8EA0" }}>{t}s</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick-pick reps presets */}
            {configMode === "reps" && (
              <div style={{ display:"flex", gap:"6px" }}>
                {REPS_PRESETS.map(r=>(
                  <button key={r} onClick={()=>setConfigReps(r)} style={{ flex:1, padding:"6px 2px", borderRadius:"8px", background:configReps===r?"rgba(255,77,0,0.2)":"#0B0B12", border:configReps===r?"1px solid rgba(255,77,0,0.4)":"1px solid rgba(255,255,255,0.07)", cursor:"pointer" }}>
                    <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"12px", fontWeight:800, color:configReps===r?"#FF6B35":"#5A5A70" }}>{r}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Comenzar ejercicio CTA — abajo, naranja grande */}
        <div style={{ padding:"10px 24px 0" }}>
          <button
            onClick={()=>onStartSingle(buildExercise())}
            style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:"10px", padding:"15px 20px", borderRadius:"16px", background:"linear-gradient(90deg,#FF4D00,#FF7A00)", border:"none", cursor:"pointer", boxShadow:"0 4px 24px rgba(255,77,0,0.45)" }}
          >
            <PlayCircle size={22} color="#fff"/>
            <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"19px", fontWeight:900, color:"#fff", textTransform:"uppercase", letterSpacing:"0.06em" }}>
              Comenzar Ejercicio
            </span>
          </button>
        </div>
        <div style={{ height:"100px" }}/>
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SINGLE EXERCISE — 3-phase (countdown → active → done)
═══════════════════════════════════════════════════════════ */
function SingleExerciseScreen({ nav, exercise, machine }: { nav:(r:Route)=>void; exercise:PlanExercise; machine:MachineData }) {
  type SPhase = "countdown" | "active" | "done";
  const [phase,      setPhase]      = useState<SPhase>("countdown");
  const [count,      setCount]      = useState(5);
  const [activeTime, setActiveTime] = useState(0);
  const [elapsed,    setElapsed]    = useState(0);

  const timeSec = parseTimeSecs(exercise.reps);
  const isTime  = timeSec !== null;
  const media   = { gif: machine.gif, img: machine.img };

  // Countdown 5→0
  useEffect(() => {
    if (phase !== "countdown") return;
    if (count <= 0) { setPhase("active"); if (isTime && timeSec) setActiveTime(timeSec); return; }
    const t = setTimeout(() => setCount(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, count]);

  // Active timer (time-based)
  useEffect(() => {
    if (phase !== "active" || !isTime) return;
    if (activeTime <= 0) { finish(); return; }
    const t = setTimeout(() => { setActiveTime(a => a - 1); setElapsed(e => e + 1); }, 1000);
    return () => clearTimeout(t);
  }, [phase, activeTime, isTime]);

  // Elapsed seconds for reps-based
  useEffect(() => {
    if (phase !== "active" || isTime) return;
    const t = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(t);
  }, [phase, isTime]);

  function finish() { setPhase("done"); }

  const kcal = Math.max(4, Math.round(elapsed * 0.18));

  // ── Countdown ───────────────────────────────────────────
  if (phase === "countdown") return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:"linear-gradient(180deg,#0d0005,#0B0B12)", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 60% 50% at 50% 60%,rgba(255,77,0,0.22),transparent)", pointerEvents:"none" }}/>
      <div style={{ zIndex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:"16px" }}>
        <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"14px", fontWeight:700, color:"#FF6B35", textTransform:"uppercase", letterSpacing:"0.2em" }}>Prepárate</p>
        <div key={count} style={{ width:"160px", height:"160px", borderRadius:"50%", background:"rgba(255,77,0,0.1)", border:"3px solid rgba(255,77,0,0.4)", boxShadow:"0 0 60px rgba(255,77,0,0.35)", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"96px", fontWeight:900, color:"#FF4D00", lineHeight:1 }}>{count}</span>
        </div>
        <div style={{ textAlign:"center" }}>
          <p style={{ fontSize:"11px", color:"#8E8EA0", marginBottom:"6px" }}>Ejercicio</p>
          <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"20px", fontWeight:800, color:"#F2F2F7" }}>{machine.nameEs}</p>
          {isTime
            ? <p style={{ fontSize:"12px", color:"#FF6B35", marginTop:"4px" }}>{exercise.reps} de trabajo</p>
            : <p style={{ fontSize:"12px", color:"#FF6B35", marginTop:"4px" }}>{exercise.series} series × {exercise.reps} reps</p>
          }
        </div>
      </div>
    </div>
  );

  // ── Active ───────────────────────────────────────────────
  if (phase === "active") return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
      <div style={{ height:"240px", flexShrink:0, padding:"14px 20px 0" }}>
        <div style={{ width:"100%", height:"100%", borderRadius:"20px", overflow:"hidden", background:"#1C1C2A" }}>
          {media.gif
            ? <ImageWithFallback src={media.gif} alt={machine.nameEs} style={{ width:"100%", height:"100%", objectFit:"contain" }}/>
            : <ImageWithFallback src={media.img} alt={machine.nameEs} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
          }
        </div>
      </div>
      <div style={{ padding:"12px 20px 0", flexShrink:0 }}>
        <p style={{ fontSize:"10px", color:"#8E8EA0", fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase" }}>En Ejecución</p>
        <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"20px", fontWeight:900, color:"#F2F2F7", lineHeight:1 }}>{machine.nameEs}</p>
      </div>
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"0 20px" }}>
        {isTime ? (
          <div style={{ textAlign:"center" }}>
            <div style={{ width:"130px", height:"130px", borderRadius:"50%", background:"linear-gradient(135deg,rgba(255,77,0,0.15),rgba(255,77,0,0.05))", border:"3px solid rgba(255,77,0,0.35)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", margin:"0 auto", boxShadow:"0 0 40px rgba(255,77,0,0.2)" }}>
              <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"52px", fontWeight:900, color:activeTime <= 5?"#FF4D00":"#F2F2F7", lineHeight:1 }}>{activeTime}</span>
              <span style={{ fontSize:"11px", color:"#8E8EA0", fontWeight:600 }}>seg</span>
            </div>
          </div>
        ) : (
          <div style={{ display:"flex", gap:"10px", justifyContent:"center" }}>
            {[{l:"Series",v:exercise.series,c:"#FF4D00"},{l:"Repeticiones",v:exercise.reps,c:"#7B61FF"}].map(({l,v,c})=>(
              <div key={l} style={{ width:"140px", background:"#141420", borderRadius:"16px", border:`1px solid ${c}22`, padding:"16px 8px", textAlign:"center" }}>
                <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"36px", fontWeight:900, color:c, lineHeight:1 }}>{v}</p>
                <p style={{ fontSize:"9px", color:"#8E8EA0", fontWeight:600, textTransform:"uppercase", marginTop:"4px" }}>{l}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <div style={{ padding:"0 20px 20px", flexShrink:0 }}>
        <button onClick={finish} style={{ width:"100%", padding:"15px", borderRadius:"16px", background:"linear-gradient(90deg,#30D158,#27A848)", border:"none", cursor:"pointer", boxShadow:"0 4px 24px rgba(48,209,88,0.35)", fontFamily:"'Barlow Condensed',sans-serif", fontSize:"20px", fontWeight:900, color:"#fff", textTransform:"uppercase", letterSpacing:"0.05em", display:"flex", alignItems:"center", justifyContent:"center", gap:"10px" }}>
          <CheckCircle2 size={22} color="#fff"/>
          Completar
        </button>
      </div>
    </div>
  );

  // ── Done ─────────────────────────────────────────────────
  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  const timeStr = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
      <div style={{ flex:1, overflowY:"auto", scrollbarWidth:"none" }}>
        {/* Hero */}
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"32px 24px 20px", background:"linear-gradient(180deg,rgba(48,209,88,0.09) 0%,transparent 100%)" }}>
          <div style={{ width:"72px", height:"72px", borderRadius:"50%", background:"linear-gradient(135deg,rgba(48,209,88,0.2),rgba(48,209,88,0.05))", border:"2.5px solid rgba(48,209,88,0.5)", boxShadow:"0 0 32px rgba(48,209,88,0.3)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:"14px" }}>
            <CheckCircle2 size={36} color="#30D158" style={{ filter:"drop-shadow(0 0 8px rgba(48,209,88,0.8))" }}/>
          </div>
          <h1 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"24px", fontWeight:900, color:"#F2F2F7", textAlign:"center", lineHeight:1.1, marginBottom:"6px" }}>¡Ejercicio Completado!</h1>
          <p style={{ fontSize:"12px", color:"#30D158", fontWeight:600 }}>{machine.nameEs} · Nº {machine.num}</p>
        </div>

        {/* Metrics */}
        <div style={{ padding:"12px 24px 0" }}>
          <p style={{ fontSize:"11px", color:"#8E8EA0", fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:"12px" }}>Tu Sesión</p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px" }}>
            {[
              { label:"Tiempo Total",   value:timeStr,           unit:"",        color:"#FF4D00", bg:"rgba(255,77,0,0.12)",    icon:Clock },
              { label:"Kcal Estimadas", value:`${kcal}`,         unit:"kcal",    color:"#FFD60A", bg:"rgba(255,214,10,0.10)",  icon:Flame },
              { label:"Series Hechas",  value:exercise.series,   unit:"series",  color:"#7B61FF", bg:"rgba(123,97,255,0.12)", icon:BarChart2 },
              { label:"Repeticiones",   value:isTime?"—":exercise.reps, unit:isTime?"tiempo":"reps", color:"#30D158", bg:"rgba(48,209,88,0.10)", icon:TrendingUp },
            ].map(({ label, value, unit, color, bg, icon:Icon })=>(
              <div key={label} style={{ background:"#141420", borderRadius:"18px", border:"1px solid rgba(255,255,255,0.06)", padding:"16px 14px" }}>
                <div style={{ width:"32px", height:"32px", borderRadius:"10px", background:bg, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:"10px" }}>
                  <Icon size={16} color={color}/>
                </div>
                <div style={{ display:"flex", alignItems:"baseline", gap:"4px" }}>
                  <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"28px", fontWeight:900, color, lineHeight:1 }}>{value}</span>
                  <span style={{ fontSize:"10px", color:"#8E8EA0" }}>{unit}</span>
                </div>
                <p style={{ fontSize:"10px", color:"#8E8EA0", marginTop:"3px", fontWeight:500 }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Muscle worked */}
        <div style={{ padding:"14px 24px 0" }}>
          <p style={{ fontSize:"11px", color:"#8E8EA0", fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:"10px" }}>Músculos Trabajados</p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:"8px" }}>
            {machine.muscles.map((m,i)=>(
              <div key={m} style={{ padding:"6px 14px", background:i===0?"rgba(255,77,0,0.15)":"rgba(255,255,255,0.05)", borderRadius:"20px", border:i===0?"1px solid rgba(255,77,0,0.3)":"1px solid rgba(255,255,255,0.08)" }}>
                <span style={{ fontSize:"11px", color:i===0?"#FF6B35":"#C4C4D0", fontWeight:i===0?700:500 }}>{m}{i===0?" ★":""}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ height:"20px" }}/>
      </div>
      <div style={{ padding:"10px 24px 16px", flexShrink:0, display:"flex", gap:"10px" }}>
        <button onClick={()=>nav("maquina-detalle")} style={{ flex:1, padding:"13px", borderRadius:"14px", background:"#141420", border:"1px solid rgba(255,255,255,0.1)", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", fontSize:"15px", fontWeight:800, color:"#C4C4D0", textTransform:"uppercase" }}>
          Ver Máquina
        </button>
        <button onClick={()=>nav("inicio")} style={{ flex:2, padding:"13px", borderRadius:"14px", background:"linear-gradient(90deg,#FF4D00,#FF7A00)", border:"none", cursor:"pointer", boxShadow:"0 4px 20px rgba(255,77,0,0.4)", fontFamily:"'Barlow Condensed',sans-serif", fontSize:"15px", fontWeight:900, color:"#fff", textTransform:"uppercase", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px" }}>
          <Home size={16} color="#fff"/> Volver al Inicio
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   WORKOUT SESSION — 4-phase execution flow
═══════════════════════════════════════════════════════════ */
type WorkoutPhase = "countdown" | "demo" | "active" | "rest";

function parseTimeSecs(reps: string): number | null {
  const m = reps.match(/(\d+)\s*(s|seg|min)/i);
  if (!m) return null;
  return m[2].toLowerCase() === "min" ? parseInt(m[1]) * 60 : parseInt(m[1]);
}

function getExerciseMedia(name: string): { gif?: string; img: string } {
  const n = name.toLowerCase();
  if (n.includes("fondos") || n.includes("tricep") || n.includes("trícep") || n.includes("dips")) return { gif: tricepsDipsGif as string, img: tricepsDipsImg as string };
  if (n.includes("leg ext") || n.includes("extensión") || n.includes("extension") || n.includes("cuádricep") || n.includes("cuadricep")) return { gif: legExtGif as string, img: legExtImg as string };
  if (n.includes("face pull") || n.includes("jalón al") || n.includes("deltoides post") || n.includes("polea alta")) return { gif: facePullGif as string, img: facePullImg as string };
  if (n.includes("cinta") || n.includes("treadmill") || n.includes("correr") || n.includes("cardio") || n.includes("trote")) return { gif: treadmillGif as string, img: treadmillImg as string };
  if (n.includes("inclin") || n.includes("pecho sup") || n.includes("clavicular")) return { gif: inclineChestGif as string, img: inclineChestImg as string };
  return { gif: chestPressGif as string, img: chestPressImg as string };
}

const DEFAULT_WORKOUT: PlanExercise[] = [
  { name:"Prensa de Pecho en Máquina",   series:"3", reps:"12", rest:"60" },
  { name:"Fondos de Tríceps Asistidos",  series:"3", reps:"10", rest:"60" },
  { name:"Extensión de Piernas",         series:"3", reps:"15", rest:"60" },
  { name:"Face Pull",                    series:"3", reps:"12", rest:"45" },
  { name:"Cinta de Correr",              series:"1", reps:"45s", rest:"0" },
  { name:"Prensa de Pecho Inclinada",    series:"3", reps:"10", rest:"60" },
];

function WorkoutSessionScreen({ nav, exercises, onComplete }: { nav:(r:Route)=>void; exercises: PlanExercise[]; onComplete:()=>void }) {
  const exList = exercises.length > 0 ? exercises : DEFAULT_WORKOUT;

  const [phase,      setPhase]      = useState<WorkoutPhase>("countdown");
  const [exIdx,      setExIdx]      = useState(0);
  const [count,      setCount]      = useState(5);
  const [restCount,  setRestCount]  = useState(15);
  const [restPaused, setRestPaused] = useState(false);
  const [activeTime, setActiveTime] = useState(0);
  const [pulseKey,   setPulseKey]   = useState(0);

  const curEx   = exList[exIdx];
  const media   = getExerciseMedia(curEx?.name ?? "");
  const timeSec = parseTimeSecs(curEx?.reps ?? "");
  const isTime  = timeSec !== null;

  // Phase 1: countdown 5→0
  useEffect(() => {
    if (phase !== "countdown") return;
    if (count <= 0) { setPhase("demo"); setCount(5); return; }
    const t = setTimeout(() => setCount(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, count]);

  // Phase 3: active timer (time-based exercises)
  useEffect(() => {
    if (phase !== "active" || !isTime) return;
    if (activeTime <= 0) return;
    const t = setTimeout(() => setActiveTime(a => a - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, activeTime, isTime]);

  // Phase 4: rest 15→0
  useEffect(() => {
    if (phase !== "rest" || restPaused) return;
    if (restCount <= 0) { advanceExercise(); return; }
    const t = setTimeout(() => setRestCount(r => r - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, restCount, restPaused]);

  function startActive() {
    setPhase("active");
    if (isTime && timeSec) setActiveTime(timeSec);
  }

  function completeExercise() {
    setPhase("rest");
    setRestCount(15);
    setRestPaused(false);
  }

  function advanceExercise() {
    const next = exIdx + 1;
    if (next >= exList.length) { onComplete(); }
    else { setExIdx(next); setPhase("demo"); setPulseKey(k => k + 1); }
  }

  const nextEx = exList[exIdx + 1];

  // ── Phase 1: Countdown ──────────────────────────────────
  if (phase === "countdown") return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:"linear-gradient(180deg,#0d0005,#0B0B12)", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 60% 50% at 50% 60%,rgba(255,77,0,0.22),transparent)", pointerEvents:"none" }}/>
      <div style={{ zIndex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:"16px" }}>
        <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"14px", fontWeight:700, color:"#FF6B35", textTransform:"uppercase", letterSpacing:"0.2em" }}>Prepárate</p>
        <div key={count} style={{ width:"160px", height:"160px", borderRadius:"50%", background:"rgba(255,77,0,0.1)", border:"3px solid rgba(255,77,0,0.4)", boxShadow:"0 0 60px rgba(255,77,0,0.35)", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"96px", fontWeight:900, color:"#FF4D00", lineHeight:1 }}>{count}</span>
        </div>
        <div style={{ textAlign:"center" }}>
          <p style={{ fontSize:"11px", color:"#8E8EA0", marginBottom:"6px" }}>Primer ejercicio</p>
          <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"19px", fontWeight:800, color:"#F2F2F7" }}>{curEx?.name}</p>
          {isTime
            ? <p style={{ fontSize:"12px", color:"#FF6B35", marginTop:"4px" }}>{curEx.reps} de trabajo</p>
            : <p style={{ fontSize:"12px", color:"#FF6B35", marginTop:"4px" }}>{curEx?.series} series × {curEx?.reps} reps</p>
          }
        </div>
      </div>
    </div>
  );

  // ── Phase 2: Demo ───────────────────────────────────────
  if (phase === "demo") return (
    <div key={pulseKey} style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
      <div style={{ display:"flex", alignItems:"center", gap:"12px", padding:"16px 20px 0", flexShrink:0 }}>
        <div style={{ flex:1 }}>
          <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"4px" }}>
            <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"11px", fontWeight:700, color:"#FF4D00", background:"rgba(255,77,0,0.12)", border:"1px solid rgba(255,77,0,0.25)", borderRadius:"6px", padding:"2px 8px", textTransform:"uppercase" }}>
              Ejercicio {exIdx + 1} / {exList.length}
            </span>
          </div>
          <h2 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"22px", fontWeight:900, color:"#F2F2F7", lineHeight:1.1 }}>{curEx?.name}</h2>
        </div>
      </div>

      {/* GIF demo */}
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"12px 20px", overflow:"hidden" }}>
        <div style={{ width:"100%", borderRadius:"20px", overflow:"hidden", background:"#1C1C2A", boxShadow:"0 8px 32px rgba(0,0,0,0.4)" }}>
          {media.gif
            ? <ImageWithFallback src={media.gif} alt={curEx.name} style={{ width:"100%", height:"280px", objectFit:"contain" }}/>
            : <ImageWithFallback src={media.img} alt={curEx.name} style={{ width:"100%", height:"280px", objectFit:"cover" }}/>
          }
        </div>
      </div>

      {/* Metadata */}
      <div style={{ padding:"0 20px 12px", flexShrink:0 }}>
        <div style={{ display:"flex", gap:"8px", marginBottom:"14px", justifyContent:"center" }}>
          {isTime
            ? <div style={{ width:"160px", background:"#141420", borderRadius:"12px", border:"1px solid rgba(255,77,0,0.2)", padding:"10px", textAlign:"center" }}>
                <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"22px", fontWeight:900, color:"#FF4D00" }}>{curEx.reps}</p>
                <p style={{ fontSize:"9px", color:"#8E8EA0", fontWeight:600, textTransform:"uppercase", marginTop:"2px" }}>Duración</p>
              </div>
            : <>
                {[{l:"Series",v:curEx?.series},{l:"Repeticiones",v:curEx?.reps}].map(({l,v})=>(
                  <div key={l} style={{ width:"140px", background:"#141420", borderRadius:"12px", border:"1px solid rgba(255,77,0,0.15)", padding:"10px", textAlign:"center" }}>
                    <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"22px", fontWeight:900, color:"#FF4D00" }}>{v}</p>
                    <p style={{ fontSize:"8px", color:"#8E8EA0", fontWeight:600, textTransform:"uppercase", marginTop:"2px" }}>{l}</p>
                  </div>
                ))}
              </>
          }
        </div>
        <button
          onClick={startActive}
          style={{ width:"100%", padding:"15px", borderRadius:"16px", background:"linear-gradient(90deg,#FF4D00,#FF7A00)", border:"none", cursor:"pointer", boxShadow:"0 4px 24px rgba(255,77,0,0.45)", fontFamily:"'Barlow Condensed',sans-serif", fontSize:"20px", fontWeight:900, color:"#fff", textTransform:"uppercase", letterSpacing:"0.05em" }}
        >
          Comenzar
        </button>
      </div>
    </div>
  );

  // ── Phase 3: Active ─────────────────────────────────────
  if (phase === "active") return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
      {/* GIF loop at top */}
      <div style={{ height:"240px", flexShrink:0, padding:"14px 20px 0" }}>
        <div style={{ width:"100%", height:"100%", borderRadius:"20px", overflow:"hidden", background:"#1C1C2A" }}>
          {media.gif
            ? <ImageWithFallback src={media.gif} alt={curEx.name} style={{ width:"100%", height:"100%", objectFit:"contain" }}/>
            : <ImageWithFallback src={media.img} alt={curEx.name} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
          }
        </div>
      </div>

      {/* Exercise info */}
      <div style={{ padding:"12px 20px 0", flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"4px" }}>
          <p style={{ fontSize:"10px", color:"#8E8EA0", fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase" }}>EN EJECUCIÓN</p>
          <span style={{ fontSize:"10px", color:"#FF4D00", fontWeight:700 }}>{exIdx+1}/{exList.length}</span>
        </div>
        <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"20px", fontWeight:900, color:"#F2F2F7", lineHeight:1 }}>{curEx?.name}</p>
      </div>

      {/* Timer or reps — center display */}
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"0 20px" }}>
        {isTime ? (
          <div style={{ textAlign:"center" }}>
            <div style={{ width:"130px", height:"130px", borderRadius:"50%", background:"linear-gradient(135deg,rgba(255,77,0,0.15),rgba(255,77,0,0.05))", border:"3px solid rgba(255,77,0,0.35)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", margin:"0 auto", boxShadow:"0 0 40px rgba(255,77,0,0.2)" }}>
              <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"52px", fontWeight:900, color: activeTime <= 5 ? "#FF4D00" : "#F2F2F7", lineHeight:1 }}>{activeTime}</span>
              <span style={{ fontSize:"11px", color:"#8E8EA0", fontWeight:600 }}>seg</span>
            </div>
            <p style={{ fontSize:"11px", color:"#8E8EA0", marginTop:"10px" }}>Tiempo restante</p>
          </div>
        ) : (
          <div style={{ display:"flex", gap:"10px", justifyContent:"center" }}>
            {[{l:"Series",v:curEx?.series,c:"#FF4D00"},{l:"Repeticiones",v:curEx?.reps,c:"#7B61FF"}].map(({l,v,c})=>(
              <div key={l} style={{ width:"140px", background:"#141420", borderRadius:"16px", border:`1px solid ${c}22`, padding:"16px 8px", textAlign:"center" }}>
                <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"36px", fontWeight:900, color:c, lineHeight:1 }}>{v}</p>
                <p style={{ fontSize:"9px", color:"#8E8EA0", fontWeight:600, textTransform:"uppercase", marginTop:"4px" }}>{l}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Complete button */}
      <div style={{ padding:"0 20px 20px", flexShrink:0 }}>
        <button
          onClick={completeExercise}
          style={{ width:"100%", padding:"15px", borderRadius:"16px", background:"linear-gradient(90deg,#30D158,#27A848)", border:"none", cursor:"pointer", boxShadow:"0 4px 24px rgba(48,209,88,0.35)", fontFamily:"'Barlow Condensed',sans-serif", fontSize:"20px", fontWeight:900, color:"#fff", textTransform:"uppercase", letterSpacing:"0.05em", display:"flex", alignItems:"center", justifyContent:"center", gap:"10px" }}
        >
          <CheckCircle2 size={22} color="#fff"/>
          Completar
        </button>
      </div>
    </div>
  );

  // ── Phase 4: Rest ───────────────────────────────────────
  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:"linear-gradient(180deg,#000d08,#0B0B12)", position:"relative", overflow:"hidden", padding:"0 24px" }}>
      <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 55% 45% at 50% 55%,rgba(48,209,88,0.18),transparent)", pointerEvents:"none" }}/>
      <div style={{ zIndex:1, width:"100%", display:"flex", flexDirection:"column", alignItems:"center", gap:"20px" }}>
        <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"14px", fontWeight:700, color:"#30D158", textTransform:"uppercase", letterSpacing:"0.2em" }}>Descanso</p>
        <div style={{ width:"150px", height:"150px", borderRadius:"50%", background:"rgba(48,209,88,0.1)", border:"3px solid rgba(48,209,88,0.4)", boxShadow:"0 0 50px rgba(48,209,88,0.25)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
          <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"80px", fontWeight:900, color:"#30D158", lineHeight:1 }}>{restCount}</span>
          <span style={{ fontSize:"11px", color:"#8E8EA0" }}>segundos</span>
        </div>

        {nextEx ? (
          <div style={{ width:"100%", background:"#141420", borderRadius:"18px", border:"1px solid rgba(255,255,255,0.08)", padding:"14px 16px", display:"flex", alignItems:"center", gap:"12px" }}>
            <div style={{ width:"48px", height:"48px", borderRadius:"12px", overflow:"hidden", flexShrink:0 }}>
              <ImageWithFallback src={getExerciseMedia(nextEx.name).img} alt={nextEx.name} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
            </div>
            <div style={{ flex:1 }}>
              <p style={{ fontSize:"10px", color:"#8E8EA0", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:"3px" }}>Siguiente</p>
              <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"15px", fontWeight:800, color:"#F2F2F7", lineHeight:1.1 }}>{nextEx.name}</p>
              {parseTimeSecs(nextEx.reps) !== null
                ? <p style={{ fontSize:"10px", color:"#FF6B35", marginTop:"3px" }}>{nextEx.reps}</p>
                : <p style={{ fontSize:"10px", color:"#FF6B35", marginTop:"3px" }}>{nextEx.series} × {nextEx.reps} reps</p>
              }
            </div>
          </div>
        ) : (
          <div style={{ background:"rgba(48,209,88,0.08)", borderRadius:"18px", border:"1px solid rgba(48,209,88,0.2)", padding:"14px 20px", textAlign:"center" }}>
            <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"18px", fontWeight:800, color:"#30D158" }}>¡Último ejercicio completado!</p>
            <p style={{ fontSize:"11px", color:"#8E8EA0", marginTop:"4px" }}>El resumen se cargará automáticamente</p>
          </div>
        )}

        <div style={{ display:"flex", gap:"10px", width:"100%" }}>
          <button
            onClick={()=>setRestPaused(p=>!p)}
            style={{ flex:"0 0 auto", width:"52px", height:"52px", borderRadius:"14px", background:restPaused?"rgba(255,77,0,0.15)":"rgba(255,255,255,0.05)", border:restPaused?"1.5px solid rgba(255,77,0,0.35)":"1px solid rgba(255,255,255,0.1)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}
          >
            {restPaused
              ? <PlayCircle size={22} color="#FF4D00"/>
              : <Pause size={22} color="#C4C4D0"/>
            }
          </button>
          <button
            onClick={advanceExercise}
            style={{ flex:1, padding:"13px", borderRadius:"14px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", cursor:"pointer", fontFamily:"'Barlow Condensed',sans-serif", fontSize:"16px", fontWeight:800, color:"#C4C4D0", textTransform:"uppercase", letterSpacing:"0.06em" }}
          >
            Saltar Descanso →
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   WORKOUT SUMMARY
═══════════════════════════════════════════════════════════ */
function WorkoutSummaryScreen({ nav, streakDays, inGym }: { nav:(r:Route)=>void; streakDays:number; inGym:boolean }) {
  const [popupVisible, setPopupVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setPopupVisible(true), 400); return () => clearTimeout(t); }, []);
  const remaining = 5 - streakDays;
  const metrics = [
    { label:"Volumen de Carga Total",    value:"8,400", unit:"kg",     icon:Weight,   color:"#FF4D00", bg:"rgba(255,77,0,0.12)" },
    { label:"Series Ejecutadas",          value:"24",    unit:"series", icon:BarChart2, color:"#7B61FF", bg:"rgba(123,97,255,0.12)" },
    { label:"Tiempo Total Bajo Tensión",  value:"42",    unit:"min",    icon:Clock,    color:"#30D158", bg:"rgba(48,209,88,0.12)" },
  ];
  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
      <div style={{ flex:1, overflowY:"auto", scrollbarWidth:"none" }}>
        {/* Challenge progress popup — only in gym mode */}
        <div style={{ padding:"12px 20px 0", transition:"opacity 0.45s ease, transform 0.45s ease", opacity:(popupVisible && inGym)?1:0, transform:(popupVisible && inGym)?"translateY(0)":"translateY(-14px)" }}>
          <div style={{ borderRadius:"16px", background:"linear-gradient(135deg,rgba(48,209,88,0.15),rgba(48,209,88,0.06))", border:"1.5px solid rgba(48,209,88,0.35)", padding:"12px 16px", display:"flex", alignItems:"center", gap:"12px", boxShadow:"0 4px 20px rgba(48,209,88,0.12)" }}>
            <div style={{ width:"40px", height:"40px", borderRadius:"12px", background:"rgba(48,209,88,0.2)", border:"1px solid rgba(48,209,88,0.4)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:"20px" }}>🔥</div>
            <div style={{ flex:1 }}>
              <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"15px", fontWeight:900, color:"#30D158", textTransform:"uppercase", letterSpacing:"0.04em", lineHeight:1.1 }}>Progreso de Reto</p>
              <p style={{ fontSize:"12px", color:"#F2F2F7", fontWeight:600, marginTop:"2px", lineHeight:1.3 }}>
                Día <span style={{ color:"#30D158" }}>{streakDays}</span> de 5 completado
                {remaining > 0 ? ` · Faltan ${remaining} día${remaining>1?"s":""} para ganar` : " · ¡Reto completado!"}
              </p>
              <div style={{ height:"4px", background:"rgba(255,255,255,0.08)", borderRadius:"2px", marginTop:"6px", overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${(streakDays/5)*100}%`, background:"linear-gradient(90deg,#30D158,#34C759)", borderRadius:"2px", transition:"width 0.6s ease" }}/>
              </div>
              <p style={{ fontSize:"10px", color:"#8E8EA0", marginTop:"3px" }}>Reto: Entrena 5 días seguidos · 400 pts</p>
            </div>
          </div>
        </div>

        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"28px 24px 20px", background:"linear-gradient(180deg,rgba(48,209,88,0.08) 0%,transparent 100%)", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ width:"72px", height:"72px", borderRadius:"50%", background:"linear-gradient(135deg,rgba(48,209,88,0.2),rgba(48,209,88,0.05))", border:"2.5px solid rgba(48,209,88,0.5)", boxShadow:"0 0 32px rgba(48,209,88,0.3)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:"16px" }}>
            <CheckCircle2 size={36} color="#30D158" style={{ filter:"drop-shadow(0 0 8px rgba(48,209,88,0.8))" }}/>
          </div>
          <h1 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"26px", fontWeight:900, color:"#F2F2F7", textAlign:"center", lineHeight:1.1 }}>¡Rutina del Día<br/>Completada!</h1>
          <p style={{ fontSize:"12px", color:"#30D158", fontWeight:600, marginTop:"8px" }}>Miércoles · Fuerza Total — Semana 3</p>
          <div style={{ display:"flex", alignItems:"center", gap:"6px", marginTop:"12px", padding:"6px 16px", background:"linear-gradient(90deg,rgba(255,107,53,0.2),rgba(255,77,0,0.1))", borderRadius:"20px", border:"1px solid rgba(255,107,53,0.3)" }}>
            <Flame size={14} color="#FF6B35" style={{ filter:"drop-shadow(0 0 4px rgba(255,107,53,0.8))" }}/>
            <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"14px", fontWeight:800, color:"#FF6B35" }}>¡Racha extendida! 8 días seguidos</span>
          </div>
        </div>
        <div style={{ padding:"20px 24px 0" }}>
          <p style={{ fontSize:"11px", color:"#8E8EA0", fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:"12px" }}>Resumen Analítico</p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px" }}>
            {metrics.map(({ label, value, unit, icon:Icon, color, bg }, i) => (
              <div key={label} style={{ background:"#141420", borderRadius:"18px", border:"1px solid rgba(255,255,255,0.06)", padding:"16px 14px", gridColumn: i===2?"1 / -1":"auto" }}>
                <div style={{ width:"36px", height:"36px", borderRadius:"10px", background:bg, border:`1px solid ${color}33`, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:"10px" }}>
                  <Icon size={18} color={color}/>
                </div>
                <div style={{ display:"flex", alignItems:"baseline", gap:"4px" }}>
                  <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:i===2?"36px":"32px", fontWeight:900, color, lineHeight:1 }}>{value}</span>
                  <span style={{ fontSize:"12px", color:"#8E8EA0", fontWeight:500 }}>{unit}</span>
                </div>
                <p style={{ fontSize:"11px", color:"#8E8EA0", marginTop:"4px", fontWeight:500, lineHeight:1.3 }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding:"20px 24px 0" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"12px" }}>
            <p style={{ fontSize:"13px", color:"#F2F2F7", fontWeight:700 }}>Comparativa con sesión anterior</p>
            <span style={{ fontSize:"10px", color:"#30D158", fontWeight:600, background:"rgba(48,209,88,0.1)", padding:"3px 8px", borderRadius:"8px", border:"1px solid rgba(48,209,88,0.2)" }}>↑ +12%</span>
          </div>
          <div style={{ borderRadius:"18px", border:"1.5px dashed rgba(255,255,255,0.15)", background:"rgba(255,255,255,0.02)", padding:"20px" }}>
            <div style={{ width:"100%", display:"flex", alignItems:"flex-end", gap:"8px", height:"80px", marginBottom:"10px" }}>
              {[{label:"Vol.",prev:65,curr:78,color:"#FF4D00"},{label:"Series",prev:80,curr:80,color:"#7B61FF"},{label:"Tiempo",prev:55,curr:70,color:"#30D158"},{label:"Kcal",prev:70,curr:85,color:"#FFD60A"}].map(({label,prev,curr,color})=>(
                <div key={label} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:"4px" }}>
                  <div style={{ width:"100%", display:"flex", gap:"3px", alignItems:"flex-end", height:"60px" }}>
                    <div style={{ flex:1, borderRadius:"3px 3px 0 0", background:"rgba(255,255,255,0.1)", height:`${prev}%` }}/>
                    <div style={{ flex:1, borderRadius:"3px 3px 0 0", background:color, height:`${curr}%` }}/>
                  </div>
                  <span style={{ fontSize:"9px", color:"#8E8EA0", fontWeight:600 }}>{label}</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize:"9px", color:"rgba(255,255,255,0.18)", textAlign:"center" }}>MARCADOR DE POSICIÓN: Gráfico de barras comparativo de rendimiento</p>
          </div>
        </div>
        <div style={{ height:"16px" }}/>
      </div>
      <div style={{ padding:"12px 24px 16px", flexShrink:0 }}>
        <button onClick={()=>nav("inicio")} style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px", padding:"15px 20px", borderRadius:"16px", background:"linear-gradient(90deg,#FF4D00,#FF7A00)", border:"none", cursor:"pointer", boxShadow:"0 4px 24px rgba(255,77,0,0.45)" }}>
          <Home size={18} color="#fff"/>
          <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"18px", fontWeight:900, color:"#fff", textTransform:"uppercase", letterSpacing:"0.05em" }}>Finalizar y Volver al Home</span>
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   HISTORIAL
═══════════════════════════════════════════════════════════ */
function HistorialScreen({ nav }: { nav:(r:Route)=>void }) {
  const [period, setPeriod] = useState<"semana"|"mes"|"total">("semana");

  // Weekly calendar data — L=Mon to D=Sun
  const weekDays = ["L","M","X","J","V","S","D"];
  const weekNums  = [7,8,9,10,11,12,13]; // day numbers
  const trainedDays = new Set([0,1,2,4,5]); // Mon Tue Wed Fri Sat trained
  const todayIdx = 3; // Thursday = today

  // Activity bars height per day (0-100)
  const actBars = [85,72,90,0,65,78,0];

  // Weight data for SVG line chart
  const weightData = [82.5, 82.0, 81.6, 81.3, 81.0, 80.8, 80.5, 80.3, 80.1, 79.9, 79.7, 79.5];
  const weightDates = ["1 Jun","5","10","15","20","25","1 Jul","5","10","—","—","—"];
  const targetWeight = 78;

  // Muscle frequency data
  const muscles = [
    { name:"Pecho",    pct:85, color:"#FF4D00" },
    { name:"Espalda",  pct:70, color:"#7B61FF" },
    { name:"Piernas",  pct:60, color:"#30D158" },
    { name:"Hombros",  pct:50, color:"#FFD60A" },
    { name:"Bíceps",   pct:65, color:"#FF6B35" },
    { name:"Core",     pct:40, color:"#7B61FF" },
  ];

  // Recent sessions
  const sessions = [
    { date:"Hoy, 09:41",   name:"Fuerza — Pecho & Tríceps",  dur:"48 min", kcal:"420", icon:"💪" },
    { date:"Ayer, 08:15",  name:"Piernas — Sentadillas",      dur:"52 min", kcal:"510", icon:"🦵" },
    { date:"Lun, 07:55",   name:"Espalda — Tracción",         dur:"44 min", kcal:"380", icon:"🦅" },
    { date:"Sáb, 09:20",   name:"Hombros — Press militar",    dur:"40 min", kcal:"340", icon:"⬆️" },
    { date:"Vie, 07:30",   name:"Core & Cardio HIIT",         dur:"28 min", kcal:"290", icon:"⚡" },
  ];

  // Stats per period
  const stats: Record<string,{sessions:string;kcal:string;time:string}> = {
    semana: { sessions:"5", kcal:"1,940", time:"212 min" },
    mes:    { sessions:"19", kcal:"7,620", time:"856 min" },
    total:  { sessions:"84", kcal:"32,400", time:"3,780 min" },
  };
  const cur = stats[period];

  // IMC
  const peso=79.9, altura=1.75;
  const imc = peso/(altura*altura); // ~26.1
  const imcPct = Math.min(100, Math.max(0, ((imc-15)/(40-15))*100));

  return (
    <div style={{ flex:1, overflowY:"auto", scrollbarWidth:"none" }}>
      {/* Header */}
      <div style={{ padding:"16px 24px 10px", display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
        <div>
          <h1 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"28px", fontWeight:800, color:"#F2F2F7" }}>Progreso</h1>
          <p style={{ fontSize:"12px", color:"#8E8EA0", marginTop:"2px" }}>Análisis y evolución de tu entrenamiento</p>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:"6px", background:"rgba(255,77,0,0.1)", borderRadius:"12px", padding:"6px 12px", border:"1px solid rgba(255,77,0,0.2)" }}>
          <Flame size={14} color="#FF4D00"/>
          <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"15px", fontWeight:800, color:"#FF4D00" }}>8 días</span>
          <span style={{ fontSize:"10px", color:"#FF6B35" }}>racha</span>
        </div>
      </div>

      {/* Period tabs */}
      <div style={{ display:"flex", gap:"6px", padding:"0 24px 14px" }}>
        {(["semana","mes","total"] as const).map(p=>(
          <button key={p} onClick={()=>setPeriod(p)} style={{ flex:1, padding:"7px 4px", borderRadius:"10px", background:period===p?"rgba(255,77,0,0.18)":"#141420", border:period===p?"1px solid rgba(255,77,0,0.35)":"1px solid rgba(255,255,255,0.07)", cursor:"pointer" }}>
            <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"13px", fontWeight:700, color:period===p?"#FF4D00":"#8E8EA0", textTransform:"capitalize" }}>{p==="semana"?"Esta Semana":p==="mes"?"Este Mes":"Total"}</span>
          </button>
        ))}
      </div>

      {/* Summary metrics */}
      <div style={{ display:"flex", gap:"8px", padding:"0 24px 16px" }}>
        {[
          { label:"Entrenos", value:cur.sessions, color:"#FF4D00", emoji:"🏋️" },
          { label:"Kcal",     value:cur.kcal,     color:"#FFD60A", emoji:"🔥" },
          { label:"Tiempo",   value:cur.time,     color:"#30D158", emoji:"⏱️" },
        ].map(({label,value,color,emoji})=>(
          <div key={label} style={{ flex:1, background:"#141420", borderRadius:"14px", border:"1px solid rgba(255,255,255,0.06)", padding:"12px 8px", textAlign:"center" }}>
            <div style={{ fontSize:"18px", marginBottom:"4px" }}>{emoji}</div>
            <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"16px", fontWeight:900, color, lineHeight:1 }}>{value}</p>
            <p style={{ fontSize:"9px", color:"#8E8EA0", marginTop:"4px", fontWeight:600 }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Weekly calendar */}
      <div style={{ margin:"0 24px 16px", background:"#141420", borderRadius:"16px", border:"1px solid rgba(255,255,255,0.07)", padding:"14px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"12px" }}>
          <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"15px", fontWeight:800, color:"#F2F2F7" }}>Semana Actual</p>
          <p style={{ fontSize:"10px", color:"#8E8EA0" }}>7 – 13 Jul</p>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between" }}>
          {weekDays.map((d,i)=>{
            const trained = trainedDays.has(i);
            const isToday = i === todayIdx;
            return (
              <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"5px" }}>
                <span style={{ fontSize:"9px", fontWeight:700, color:isToday?"#FF4D00":"#8E8EA0" }}>{d}</span>
                <div style={{ width:"32px", height:"32px", borderRadius:"50%", background:trained?"linear-gradient(135deg,#FF4D00,#FF7A00)":isToday?"rgba(255,77,0,0.12)":"rgba(255,255,255,0.05)", border:isToday&&!trained?"1.5px solid rgba(255,77,0,0.4)":"none", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"13px", fontWeight:800, color:trained?"#fff":isToday?"#FF6B35":"#8E8EA0" }}>{weekNums[i]}</span>
                </div>
                {trained ? <div style={{ width:"4px", height:"4px", borderRadius:"50%", background:"#FF4D00" }}/> : <div style={{ width:"4px", height:"4px" }}/>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Activity bars */}
      <div style={{ margin:"0 24px 16px", background:"#141420", borderRadius:"16px", border:"1px solid rgba(255,255,255,0.07)", padding:"14px" }}>
        <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"15px", fontWeight:800, color:"#F2F2F7", marginBottom:"12px" }}>Actividad Semanal</p>
        <div style={{ display:"flex", alignItems:"flex-end", gap:"6px", height:"70px" }}>
          {actBars.map((h,i)=>(
            <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:"4px", height:"100%", justifyContent:"flex-end" }}>
              <div style={{ width:"100%", borderRadius:"4px 4px 2px 2px", background:h>0?(i===todayIdx?"rgba(255,77,0,0.3)":"linear-gradient(180deg,#FF4D00,#FF7A00)"):"rgba(255,255,255,0.05)", height:`${h}%` }}/>
              <span style={{ fontSize:"8px", color:i===todayIdx?"#FF4D00":"#8E8EA0", fontWeight:700 }}>{weekDays[i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Weight chart */}
      <div style={{ margin:"0 24px 16px", background:"#141420", borderRadius:"16px", border:"1px solid rgba(255,255,255,0.07)", padding:"14px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"10px" }}>
          <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"15px", fontWeight:800, color:"#F2F2F7" }}>Evolución de Peso</p>
          <div style={{ background:"rgba(48,209,88,0.12)", border:"1px solid rgba(48,209,88,0.25)", borderRadius:"8px", padding:"3px 8px" }}>
            <span style={{ fontSize:"11px", color:"#30D158", fontWeight:700 }}>-3.0 kg</span>
          </div>
        </div>
        {(() => {
          const W = 310, H = 90;
          const min = Math.min(...weightData, targetWeight) - 1;
          const max = Math.max(...weightData) + 1;
          const px = (i:number) => (i/(weightData.length-1))*W;
          const py = (v:number) => H - ((v-min)/(max-min))*H;
          const pts = weightData.map((v,i)=>`${px(i)},${py(v)}`).join(" ");
          const area = `M${px(0)},${py(weightData[0])} ` + weightData.map((v,i)=>`L${px(i)},${py(v)}`).join(" ") + ` L${px(weightData.length-1)},${H} L0,${H} Z`;
          const targetY = py(targetWeight);
          const lastX = px(weightData.length-1);
          const lastY = py(weightData[weightData.length-1]);
          return (
            <svg width="100%" viewBox={`0 0 ${W} ${H+16}`} style={{ overflow:"visible" }}>
              <defs>
                <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF4D00" stopOpacity="0.35"/>
                  <stop offset="100%" stopColor="#FF4D00" stopOpacity="0.03"/>
                </linearGradient>
              </defs>
              {/* Target line */}
              <line x1="0" y1={targetY} x2={W} y2={targetY} stroke="#30D158" strokeWidth="1.5" strokeDasharray="5,4" opacity="0.6"/>
              <text x={W-2} y={targetY-4} textAnchor="end" fill="#30D158" fontSize="8" fontFamily="Barlow" fontWeight="700">{targetWeight} kg</text>
              {/* Area fill */}
              <path d={area} fill="url(#wg)"/>
              {/* Line */}
              <polyline points={pts} fill="none" stroke="#FF4D00" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/>
              {/* Last point */}
              <circle cx={lastX} cy={lastY} r="4" fill="#FF4D00" stroke="#0B0B12" strokeWidth="2"/>
              <text x={lastX} y={lastY-8} textAnchor="middle" fill="#FF4D00" fontSize="9" fontFamily="Barlow" fontWeight="800">{weightData[weightData.length-1]} kg</text>
              {/* X axis labels */}
              <text x="0" y={H+14} fill="#8E8EA0" fontSize="8" fontFamily="Barlow">1 Jun</text>
              <text x={W/2} y={H+14} textAnchor="middle" fill="#8E8EA0" fontSize="8" fontFamily="Barlow">1 Jul</text>
              <text x={W} y={H+14} textAnchor="end" fill="#FF6B35" fontSize="8" fontFamily="Barlow" fontWeight="700">Hoy</text>
            </svg>
          );
        })()}
      </div>

      {/* IMC meter */}
      <div style={{ margin:"0 24px 16px", background:"#141420", borderRadius:"16px", border:"1px solid rgba(255,255,255,0.07)", padding:"14px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"10px" }}>
          <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"15px", fontWeight:800, color:"#F2F2F7" }}>Índice de Masa Corporal</p>
          <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"18px", fontWeight:900, color:"#FFD60A" }}>{imc.toFixed(1)}</span>
        </div>
        <div style={{ position:"relative", height:"14px", borderRadius:"7px", background:"linear-gradient(90deg,#3B82F6 0%,#30D158 25%,#FFD60A 50%,#FF6B35 75%,#FF3B30 100%)", marginBottom:"6px" }}>
          <div style={{ position:"absolute", top:"-3px", left:`${imcPct}%`, transform:"translateX(-50%)", width:"20px", height:"20px", borderRadius:"50%", background:"#F2F2F7", border:"3px solid #FFD60A", boxShadow:"0 2px 8px rgba(0,0,0,0.6)", zIndex:1 }}/>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between" }}>
          {["Bajo","Normal","Sobrepeso","Obesidad"].map(l=>(
            <span key={l} style={{ fontSize:"8px", color:"#8E8EA0", fontWeight:600 }}>{l}</span>
          ))}
        </div>
        <p style={{ fontSize:"11px", color:"#C4C4D0", marginTop:"6px", textAlign:"center" }}>Sobrepeso leve · objetivo: {targetWeight} kg</p>
      </div>

      {/* Muscle frequency */}
      <div style={{ margin:"0 24px 16px", background:"#141420", borderRadius:"16px", border:"1px solid rgba(255,255,255,0.07)", padding:"14px" }}>
        <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"15px", fontWeight:800, color:"#F2F2F7", marginBottom:"12px" }}>Frecuencia Muscular</p>
        <div style={{ display:"flex", flexDirection:"column", gap:"9px" }}>
          {muscles.map(({name,pct,color})=>(
            <div key={name}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"4px" }}>
                <span style={{ fontSize:"11px", color:"#C4C4D0", fontWeight:600 }}>{name}</span>
                <span style={{ fontSize:"11px", color, fontWeight:700 }}>{pct}%</span>
              </div>
              <div style={{ height:"6px", background:"rgba(255,255,255,0.07)", borderRadius:"3px", overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${pct}%`, background:`linear-gradient(90deg,${color},${color}99)`, borderRadius:"3px" }}/>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent sessions */}
      <div style={{ padding:"0 24px 0" }}>
        <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"15px", fontWeight:800, color:"#F2F2F7", marginBottom:"10px" }}>Sesiones Recientes</p>
        <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
          {sessions.map((s,i)=>(
            <div key={i} style={{ background:"#141420", borderRadius:"14px", border:"1px solid rgba(255,255,255,0.06)", padding:"12px 14px", display:"flex", alignItems:"center", gap:"12px" }}>
              <div style={{ width:"40px", height:"40px", borderRadius:"13px", background:"rgba(255,77,0,0.12)", border:"1px solid rgba(255,77,0,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"18px", flexShrink:0 }}>{s.icon}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"14px", fontWeight:700, color:"#F2F2F7", lineHeight:1.1, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{s.name}</p>
                <p style={{ fontSize:"10px", color:"#8E8EA0", marginTop:"2px" }}>{s.date}</p>
              </div>
              <div style={{ textAlign:"right", flexShrink:0 }}>
                <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"13px", fontWeight:800, color:"#F2F2F7" }}>{s.dur}</p>
                <p style={{ fontSize:"10px", color:"#FF6B35", fontWeight:600, marginTop:"1px" }}>{s.kcal} kcal</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ height:"110px" }}/>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   HISTORIAL STATS
═══════════════════════════════════════════════════════════ */
function HistorialStatsScreen({ nav }: { nav:(r:Route)=>void }) {
  const [period, setPeriod] = useState<"Semanal"|"Mensual"|"Trimestral">("Mensual");
  const prs = [
    { exercise:"Press de Banca",  record:"120 kg", date:"Hace 3 días",   delta:"+5 kg",   icon:"🏋️" },
    { exercise:"Sentadilla Libre",record:"150 kg", date:"Hace 1 semana", delta:"+10 kg",  icon:"🦵" },
    { exercise:"Peso Muerto",     record:"180 kg", date:"Hace 2 semanas",delta:"+7.5 kg", icon:"💪" },
    { exercise:"Press Militar",   record:"80 kg",  date:"Hace 4 días",   delta:"+2.5 kg", icon:"⬆️" },
  ];
  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
      <BackHeader title="Tablero Estadístico" subtitle="Evolución de tu rendimiento" onBack={()=>nav("historial")}/>
      <div style={{ flex:1, overflowY:"auto", scrollbarWidth:"none", padding:"0 24px" }}>
        <div style={{ marginTop:"16px", marginBottom:"16px" }}>
          <div style={{ display:"flex", background:"#141420", borderRadius:"16px", border:"1px solid rgba(255,255,255,0.07)", padding:"4px", gap:"4px" }}>
            {(["Semanal","Mensual","Trimestral"] as const).map(p=>{
              const isA=period===p;
              return <button key={p} onClick={()=>setPeriod(p)} style={{ flex:1, padding:"9px 4px", borderRadius:"12px", border:"none", cursor:"pointer", background:isA?"linear-gradient(135deg,rgba(255,77,0,0.25),rgba(255,77,0,0.1))":"transparent", outline:isA?"1.5px solid rgba(255,77,0,0.4)":"none" }}>
                <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"14px", fontWeight:800, color:isA?"#FF6B35":"#8E8EA0" }}>{p}</span>
              </button>;
            })}
          </div>
        </div>
        <div style={{ marginBottom:"20px" }}>
          <p style={{ fontSize:"13px", color:"#F2F2F7", fontWeight:700, marginBottom:"12px" }}>Evolución — {period}</p>
          <div style={{ borderRadius:"20px", border:"1.5px dashed rgba(255,255,255,0.12)", background:"rgba(255,255,255,0.02)", padding:"20px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"6px" }}>
              {["Ene","Feb","Mar","Abr","May","Jun"].map(m=><span key={m} style={{ fontSize:"9px", color:"#3A3A50" }}>{m}</span>)}
            </div>
            <div style={{ height:"100px", position:"relative", marginBottom:"12px" }}>
              <svg width="100%" height="100" viewBox="0 0 320 100" preserveAspectRatio="none">
                {[25,50,75].map(y=><line key={y} x1="0" y1={y} x2="320" y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>)}
                <polyline points="0,70 53,65 107,60 160,55 213,52 267,48 320,45" fill="none" stroke="#FF4D00" strokeWidth="2" strokeLinecap="round"/>
                <polyline points="0,80 53,75 107,68 160,62 213,58 267,54 320,50" fill="none" stroke="#7B61FF" strokeWidth="2" strokeDasharray="4 3"/>
                <polyline points="0,40 53,42 107,38 160,35 213,32 267,30 320,28" fill="none" stroke="#30D158" strokeWidth="2" strokeDasharray="2 4"/>
              </svg>
            </div>
            <div style={{ display:"flex", gap:"14px", marginBottom:"10px" }}>
              {[{label:"Peso corp.",color:"#FF4D00"},{label:"Masa muscular",color:"#7B61FF"},{label:"% Grasa",color:"#30D158"}].map(({label,color})=>(
                <div key={label} style={{ display:"flex", alignItems:"center", gap:"5px" }}>
                  <div style={{ width:"12px", height:"3px", borderRadius:"1px", background:color }}/>
                  <span style={{ fontSize:"9px", color:"#8E8EA0" }}>{label}</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize:"9px", color:"rgba(255,255,255,0.18)", textAlign:"center" }}>MARCADOR DE POSICIÓN: Gráfica lineal interactiva de evolución corporal</p>
          </div>
        </div>
        <p style={{ fontSize:"11px", color:"#8E8EA0", fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:"12px" }}>Récords Personales (PR)</p>
        <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
          {prs.map((pr,i)=>(
            <div key={i} style={{ background:"#141420", borderRadius:"16px", border:"1px solid rgba(255,255,255,0.06)", padding:"14px 16px", display:"flex", alignItems:"center", gap:"12px" }}>
              <div style={{ width:"42px", height:"42px", borderRadius:"12px", background:"rgba(255,77,0,0.1)", border:"1px solid rgba(255,77,0,0.2)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:"18px" }}>{pr.icon}</div>
              <div style={{ flex:1 }}>
                <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"16px", fontWeight:700, color:"#F2F2F7" }}>{pr.exercise}</p>
                <p style={{ fontSize:"10px", color:"#8E8EA0", marginTop:"3px" }}>{pr.date}</p>
              </div>
              <div style={{ textAlign:"right" }}>
                <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"18px", fontWeight:900, color:"#F2F2F7" }}>{pr.record}</p>
                <p style={{ fontSize:"11px", color:"#30D158", fontWeight:700 }}>{pr.delta}</p>
              </div>
            </div>
          ))}
        </div>
        <div style={{ height:"100px" }}/>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   GAMIFICATION
═══════════════════════════════════════════════════════════ */
const CHALLENGES = [
  { title:"Completa 4 asistencias esta semana",     pts:200, done:0, total:4, icon:"📅", color:"#FF4D00" },
  { title:"Realiza 3 sesiones de piernas este mes", pts:300, done:0, total:3, icon:"🦵", color:"#7B61FF" },
  { title:"Supera tu PR de Sentadilla",              pts:500, done:0, total:1, icon:"🏆", color:"#FFD60A" },
  { title:"Entrena 5 días seguidos sin faltar", subtitle:"Completa al menos 1 rutina por día", pts:400, done:0, total:5, icon:"🔥", color:"#30D158", isStreak:true },
  { title:"Registra tu peso 3 semanas seguidas",     pts:150, done:0, total:3, icon:"⚖️", color:"#7B61FF" },
  { title:"Completa 10 sesiones de cardio",          pts:350, done:0, total:10,icon:"🏃", color:"#FF6B35" },
];

function GamificationScreen({ nav, earnedCoupons, points, streakDays, inGym }: { nav:(r:Route)=>void; earnedCoupons:EarnedCoupon[]; points:number; streakDays:number; inGym:boolean }) {
  const [section, setSection] = useState<"retos"|"completados">("retos");

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", position:"relative" }}>
      <div style={{ flex:1, overflowY:"auto", scrollbarWidth:"none" }}>
        {/* Header */}
        <div style={{ padding:"16px 24px 0" }}>
          <p style={{ fontSize:"12px", color:"#8E8EA0", fontWeight:500, letterSpacing:"0.06em", textTransform:"uppercase" }}>Centro de</p>
          <h1 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"26px", fontWeight:800, color:"#F2F2F7" }}>Premios</h1>
        </div>

        {/* Points card */}
        <div style={{ margin:"14px 24px 0", borderRadius:"20px", background:"linear-gradient(135deg,#1a1000,#2d1800,#0d0d1a)", border:"1px solid rgba(255,214,10,0.3)", padding:"18px 20px", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:"-20px", right:"-20px", width:"120px", height:"120px", borderRadius:"50%", background:"radial-gradient(circle,rgba(255,214,10,0.15),transparent 70%)", pointerEvents:"none" }}/>
          <div style={{ display:"flex", alignItems:"center", gap:"14px", position:"relative" }}>
            <div style={{ width:"52px", height:"52px", borderRadius:"16px", background:"rgba(255,214,10,0.15)", border:"1px solid rgba(255,214,10,0.35)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Star size={26} color="#FFD60A" style={{ filter:"drop-shadow(0 0 8px rgba(255,214,10,0.8))" }}/>
            </div>
            <div style={{ flex:1 }}>
              <p style={{ fontSize:"11px", color:"#8E8EA0", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:"2px" }}>Puntos acumulados</p>
              <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"36px", fontWeight:900, color:"#FFD60A", lineHeight:1, filter:"drop-shadow(0 0 12px rgba(255,214,10,0.5))" }}>{points.toLocaleString("es")}</span>
              <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"18px", color:"#FFD60A", marginLeft:"6px" }}>pts</span>
            </div>
          </div>
          <div style={{ display:"flex", gap:"10px", marginTop:"14px" }}>
            <button onClick={()=>nav("tienda-premios")} style={{ flex:1, padding:"10px", borderRadius:"12px", background:"linear-gradient(90deg,#FFD60A,#FF9500)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:"6px" }}>
              <ShoppingBag size={16} color="#0B0B12"/>
              <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"14px", fontWeight:900, color:"#0B0B12" }}>Tienda de Premios</span>
            </button>
            <button onClick={()=>nav("coupon-wallet")} style={{ flex:1, padding:"10px", borderRadius:"12px", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:"6px" }}>
              <Ticket size={16} color="#F2F2F7"/>
              <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"14px", fontWeight:800, color:"#F2F2F7" }}>Mis Cupones</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ padding:"14px 24px 0" }}>
          <div style={{ display:"flex", background:"#141420", borderRadius:"14px", border:"1px solid rgba(255,255,255,0.07)", padding:"4px", gap:"4px" }}>
            {([["retos","Retos Activos","🎯"],["completados","Retos Completados","✅"]] as const).map(([id,label,emoji])=>{
              const isA=section===id;
              return <button key={id} onClick={()=>setSection(id as "retos"|"completados")} style={{ flex:1, padding:"9px 4px", borderRadius:"10px", border:"none", cursor:"pointer", background:isA?"linear-gradient(135deg,rgba(255,77,0,0.2),rgba(255,77,0,0.08))":"transparent", outline:isA?"1.5px solid rgba(255,77,0,0.35)":"none", display:"flex", alignItems:"center", justifyContent:"center", gap:"6px" }}>
                <span style={{ fontSize:"14px" }}>{emoji}</span>
                <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"14px", fontWeight:800, color:isA?"#FF6B35":"#8E8EA0" }}>{label}</span>
              </button>;
            })}
          </div>
        </div>

        {/* Retos Activos — all at 0 progress */}
        {section==="retos" && (
          <div style={{ padding:"12px 24px 0", display:"flex", flexDirection:"column", gap:"10px" }}>
            {CHALLENGES.map((c,i)=>{
              const done = (c as any).isStreak ? streakDays : c.done;
              const pct = Math.round((done/c.total)*100);
              return (
              <div key={i} style={{ background:"#141420", borderRadius:"16px", border:`1px solid ${(c as any).isStreak ? "rgba(48,209,88,0.25)" : "rgba(255,255,255,0.06)"}`, padding:"14px 16px" }}>
                <div style={{ display:"flex", alignItems:"flex-start", gap:"12px", marginBottom:"10px" }}>
                  <div style={{ width:"38px", height:"38px", borderRadius:"12px", background:`${c.color}18`, border:`1px solid ${c.color}33`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"18px", flexShrink:0 }}>{c.icon}</div>
                  <div style={{ flex:1 }}>
                    <p style={{ fontSize:"12px", color:"#F2F2F7", fontWeight:600, lineHeight:1.3 }}>{c.title}</p>
                    {(c as any).subtitle && <p style={{ fontSize:"10px", color:"#8E8EA0", marginTop:"2px", fontStyle:"italic" }}>{(c as any).subtitle}</p>}
                    <div style={{ display:"flex", alignItems:"center", gap:"6px", marginTop:"4px" }}>
                      <Star size={11} color="#FFD60A"/>
                      <span style={{ fontSize:"11px", color:"#FFD60A", fontWeight:700 }}>{c.pts} pts al completar</span>
                    </div>
                  </div>
                </div>
                <div style={{ height:"5px", background:"rgba(255,255,255,0.06)", borderRadius:"3px", overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${pct}%`, background:`linear-gradient(90deg,${c.color},${c.color}99)`, borderRadius:"3px" }}/>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", marginTop:"5px" }}>
                  <span style={{ fontSize:"10px", color:"#8E8EA0" }}>{done} de {c.total} completados</span>
                  <span style={{ fontSize:"10px", color: pct>0 ? c.color : "#3A3A50", fontWeight:600 }}>{pct}%</span>
                </div>
              </div>
              );
            })}
          </div>
        )}

        {/* Retos Completados */}
        {section==="completados" && (
          <div style={{ padding:"12px 24px 0", display:"flex", flexDirection:"column", gap:"10px" }}>
            <div style={{ textAlign:"center", padding:"40px 20px", color:"#8E8EA0" }}>
              <div style={{ fontSize:"40px", marginBottom:"12px" }}>🏆</div>
              <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"18px", fontWeight:800, color:"#C4C4D0", marginBottom:"6px" }}>Aún no has completado retos</p>
              <p style={{ fontSize:"12px", lineHeight:1.5 }}>Completa los retos activos para<br/>verlos aquí y ganar tus puntos</p>
            </div>
          </div>
        )}
        <div style={{ height:"100px" }}/>
      </div>


    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   TIENDA DE PREMIOS
═══════════════════════════════════════════════════════════ */
const TIENDA_ITEMS = [
  { title:"15% Descuento en Suplementos", subtitle:"Tienda Interna · Imperium Cross",  emoji:"💊", color:"#FF4D00", pts:500,  exp:"31 Jul 2026", code:"IC-SUP-15" },
  { title:"Batido Proteico Gratis",        subtitle:"1 unidad · Counter del gimnasio",  emoji:"🥤", color:"#30D158", pts:300,  exp:"20 Jul 2026", code:"IC-BAT-FREE" },
  { title:"20% Descuento en Matrícula",    subtitle:"Próxima mensualidad",              emoji:"🏋️", color:"#7B61FF", pts:1000, exp:"15 Ago 2026", code:"IC-MAT-20" },
  { title:"Clase Especial Gratuita",       subtitle:"CrossFit · Con instructor asig.",  emoji:"⚡", color:"#FFD60A", pts:800,  exp:"31 Ago 2026", code:"IC-CLS-FREE" },
  { title:"Sesión de Masajes Deportivos",  subtitle:"30 min · Área de recuperación",    emoji:"💆", color:"#FF6B35", pts:600,  exp:"30 Jul 2026", code:"IC-MSG-30" },
  { title:"Botella Imperium Cross",        subtitle:"Merchandising oficial del gym",     emoji:"🍶", color:"#7B61FF", pts:400,  exp:"31 Dic 2026", code:"IC-BOT-OFF" },
];

function TiendaPremiosScreen({ nav, points, onRedeem }: { nav:(r:Route)=>void; points:number; onRedeem:(c:EarnedCoupon, cost:number)=>void }) {
  const [confirm, setConfirm] = useState<(typeof TIENDA_ITEMS)[number]|null>(null);
  const [redeemed, setRedeemed] = useState<Set<string>>(new Set());

  function doRedeem(item: typeof TIENDA_ITEMS[number]) {
    const coupon: EarnedCoupon = {
      title: item.title, code: `${item.code}-${Date.now().toString(36).toUpperCase()}`,
      emoji: item.emoji, color: item.color, pts: item.pts, exp: item.exp, subtitle: item.subtitle,
    };
    onRedeem(coupon, item.pts);
    setRedeemed(p => new Set([...p, item.code]));
    setConfirm(null);
  }

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
      <BackHeader title="Tienda de Premios" subtitle="Canjea tus puntos por beneficios" onBack={()=>nav("gamification")}/>

      {/* Points balance */}
      <div style={{ margin:"10px 24px 0", padding:"10px 14px", background:"rgba(255,214,10,0.08)", borderRadius:"12px", border:"1px solid rgba(255,214,10,0.2)", display:"flex", alignItems:"center", gap:"8px" }}>
        <Star size={16} color="#FFD60A"/>
        <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"18px", fontWeight:900, color:"#FFD60A" }}>{points.toLocaleString("es")} pts disponibles</span>
      </div>

      <div style={{ flex:1, overflowY:"auto", scrollbarWidth:"none", padding:"12px 24px 0" }}>
        <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
          {TIENDA_ITEMS.map((item,i)=>{
            const canAfford = points >= item.pts;
            const alreadyRedeemed = redeemed.has(item.code);
            return (
              <div key={i} style={{ background:"#141420", borderRadius:"18px", border:`1px solid ${alreadyRedeemed?"rgba(48,209,88,0.3)":"rgba(255,255,255,0.07)"}`, overflow:"hidden" }}>
                <div style={{ height:"3px", background:`linear-gradient(90deg,${item.color},${item.color}66)` }}/>
                <div style={{ padding:"14px 16px" }}>
                  <div style={{ display:"flex", alignItems:"flex-start", gap:"12px", marginBottom:"12px" }}>
                    <div style={{ width:"48px", height:"48px", borderRadius:"14px", background:`${item.color}18`, border:`1px solid ${item.color}30`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:"22px" }}>{item.emoji}</div>
                    <div style={{ flex:1 }}>
                      <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"16px", fontWeight:800, color:"#F2F2F7" }}>{item.title}</p>
                      <p style={{ fontSize:"11px", color:"#8E8EA0", marginTop:"3px" }}>{item.subtitle}</p>
                      <p style={{ fontSize:"10px", color:"#8E8EA0", marginTop:"2px" }}>Vence: {item.exp}</p>
                    </div>
                    <div style={{ textAlign:"right", flexShrink:0 }}>
                      <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"20px", fontWeight:900, color:canAfford?"#FFD60A":"#3A3A50", lineHeight:1 }}>{item.pts}</p>
                      <p style={{ fontSize:"9px", color:"#8E8EA0", marginTop:"1px" }}>pts</p>
                    </div>
                  </div>
                  {alreadyRedeemed ? (
                    <div style={{ padding:"9px", borderRadius:"10px", background:"rgba(48,209,88,0.1)", border:"1px solid rgba(48,209,88,0.25)", display:"flex", alignItems:"center", justifyContent:"center", gap:"6px" }}>
                      <CheckCircle2 size={14} color="#30D158"/>
                      <span style={{ fontSize:"13px", fontWeight:700, color:"#30D158" }}>Canjeado — revisa Mis Cupones</span>
                    </div>
                  ) : (
                    <button onClick={()=>canAfford?setConfirm(item):undefined} disabled={!canAfford} style={{ width:"100%", padding:"10px", borderRadius:"12px", background:canAfford?"linear-gradient(90deg,#FFD60A,#FF9500)":"rgba(255,255,255,0.05)", border:canAfford?"none":"1px solid rgba(255,255,255,0.07)", cursor:canAfford?"pointer":"default", display:"flex", alignItems:"center", justifyContent:"center", gap:"6px" }}>
                      <ShoppingBag size={14} color={canAfford?"#0B0B12":"#3A3A50"}/>
                      <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"13px", fontWeight:900, color:canAfford?"#0B0B12":"#3A3A50", textTransform:"uppercase" }}>{canAfford?"Canjear Ahora":"Puntos Insuficientes"}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ height:"100px" }}/>
      </div>

      {/* Confirmation modal */}
      {confirm && (
        <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.8)", display:"flex", alignItems:"flex-end", zIndex:100 }}>
          <div style={{ width:"100%", background:"#141420", borderRadius:"24px 24px 0 0", padding:"24px", border:"1px solid rgba(255,255,255,0.1)", borderBottom:"none" }}>
            <div style={{ textAlign:"center", marginBottom:"20px" }}>
              <div style={{ fontSize:"44px", marginBottom:"10px" }}>{confirm.emoji}</div>
              <h2 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"22px", fontWeight:900, color:"#F2F2F7", marginBottom:"6px" }}>{confirm.title}</h2>
              <p style={{ fontSize:"12px", color:"#8E8EA0", marginBottom:"14px" }}>{confirm.subtitle}</p>
              <div style={{ display:"flex", justifyContent:"center", gap:"8px", flexWrap:"wrap" }}>
                <span style={{ padding:"5px 12px", background:"rgba(255,214,10,0.15)", border:"1px solid rgba(255,214,10,0.3)", borderRadius:"10px", fontSize:"13px", fontWeight:700, color:"#FFD60A" }}>-{confirm.pts} puntos</span>
                <span style={{ padding:"5px 12px", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"10px", fontSize:"13px", color:"#8E8EA0" }}>Vence: {confirm.exp}</span>
              </div>
            </div>
            <p style={{ textAlign:"center", fontSize:"12px", color:"#8E8EA0", marginBottom:"18px" }}>¿Confirmas el canje? Esta acción no se puede deshacer.</p>
            <div style={{ display:"flex", gap:"10px" }}>
              <button onClick={()=>setConfirm(null)} style={{ flex:1, padding:"13px", borderRadius:"14px", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", cursor:"pointer" }}>
                <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"15px", fontWeight:800, color:"#8E8EA0" }}>Cancelar</span>
              </button>
              <button onClick={()=>doRedeem(confirm)} style={{ flex:2, padding:"13px", borderRadius:"14px", background:"linear-gradient(90deg,#FFD60A,#FF9500)", border:"none", cursor:"pointer" }}>
                <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"15px", fontWeight:900, color:"#0B0B12", textTransform:"uppercase" }}>✓ Confirmar Canje</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   COUPON WALLET
═══════════════════════════════════════════════════════════ */
function CouponWalletScreen({ nav, earnedCoupons, points }: { nav:(r:Route)=>void; earnedCoupons:EarnedCoupon[]; points:number }) {
  const [selected,    setSelected]    = useState<number|null>(null);
  const [usedCoupons, setUsedCoupons] = useState<Set<number>>(new Set());

  function markUsed(i: number, e: React.MouseEvent) {
    e.stopPropagation();
    setUsedCoupons(prev => new Set([...prev, i]));
  }

  const activeCount = earnedCoupons.length - usedCoupons.size;

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
      <BackHeader title="Billetera de Cupones" subtitle={`${activeCount} cupones disponibles`} onBack={()=>nav("gamification")}/>
      <div style={{ flex:1, overflowY:"auto", scrollbarWidth:"none" }}>
        <div style={{ margin:"14px 24px 0", padding:"12px 16px", background:"linear-gradient(90deg,rgba(255,214,10,0.1),rgba(255,77,0,0.08))", borderRadius:"14px", border:"1px solid rgba(255,214,10,0.2)", display:"flex", alignItems:"center", gap:"10px" }}>
          <Star size={20} color="#FFD60A" style={{ filter:"drop-shadow(0 0 6px rgba(255,214,10,0.7))", flexShrink:0 }}/>
          <div style={{ flex:1 }}>
            <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"20px", fontWeight:900, color:"#FFD60A", lineHeight:1 }}>{points.toLocaleString("es")} puntos</p>
            <p style={{ fontSize:"11px", color:"#8E8EA0", marginTop:"2px" }}>Saldo disponible para canje</p>
          </div>
          <button onClick={()=>nav("tienda-premios")} style={{ fontSize:"11px", color:"#FFD60A", fontWeight:700, background:"rgba(255,214,10,0.1)", border:"1px solid rgba(255,214,10,0.25)", borderRadius:"8px", padding:"5px 10px", cursor:"pointer" }}>+ Canjear</button>
        </div>
        <div style={{ padding:"14px 24px 0", display:"flex", flexDirection:"column", gap:"8px" }}>
          <p style={{ fontSize:"11px", color:"#8E8EA0", fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:"4px" }}>Cupones Canjeados ({earnedCoupons.length})</p>
          {earnedCoupons.length === 0 && (
            <div style={{ textAlign:"center", padding:"30px 0", color:"#8E8EA0" }}>
              <div style={{ fontSize:"32px", marginBottom:"10px" }}>🎟️</div>
              <p style={{ fontSize:"13px", color:"#C4C4D0" }}>No hay cupones aún</p>
              <p style={{ fontSize:"11px", marginTop:"4px" }}>Ve a la Tienda de Premios para canjear puntos</p>
            </div>
          )}
          {earnedCoupons.map((c,i)=>{
            const isSel = selected===i;
            const isUsed = usedCoupons.has(i);
            return (
              <div key={i} onClick={()=>setSelected(isSel?null:i)} style={{ borderRadius:"18px", border:isUsed?"1px solid rgba(255,255,255,0.04)":isSel?`1.5px solid ${c.color}66`:"1px solid rgba(255,255,255,0.07)", background:isUsed?"rgba(255,255,255,0.02)":isSel?`linear-gradient(135deg,${c.color}18,${c.color}08)`:"#141420", cursor:"pointer", overflow:"hidden", opacity:isUsed?0.5:1 }}>
                <div style={{ display:"flex", alignItems:"center", gap:"12px", padding:"14px 16px" }}>
                  <div style={{ width:"44px", height:"44px", borderRadius:"14px", background:isUsed?"rgba(255,255,255,0.04)":`${c.color}18`, border:`1px solid ${isUsed?"rgba(255,255,255,0.08)":c.color+"33"}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:"20px" }}>{isUsed?"✓":c.emoji}</div>
                  <div style={{ flex:1 }}>
                    <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"16px", fontWeight:700, color:isUsed?"#5A5A70":"#F2F2F7", textDecoration:isUsed?"line-through":"none" }}>{c.title}</p>
                    <p style={{ fontSize:"10px", color:"#8E8EA0", marginTop:"3px" }}>{c.subtitle}</p>
                    {isUsed
                      ? <span style={{ fontSize:"10px", color:"#5A5A70", fontWeight:600, background:"rgba(255,255,255,0.05)", padding:"2px 8px", borderRadius:"6px", display:"inline-block", marginTop:"4px" }}>Utilizado</span>
                      : <span style={{ fontSize:"10px", color:c.color, fontWeight:700, background:`${c.color}15`, padding:"2px 8px", borderRadius:"6px", display:"inline-block", marginTop:"4px" }}>{c.pts} pts · Vence: {c.exp}</span>
                    }
                  </div>
                  <div style={{ color:"#8E8EA0", flexShrink:0 }}>{isSel?<ChevronUp size={16}/>:<ChevronDown size={16}/>}</div>
                </div>

                {isSel && (
                  <div style={{ borderTop:`1px solid ${isUsed?"rgba(255,255,255,0.06)":c.color+"22"}`, padding:"16px", background:"rgba(0,0,0,0.25)" }}>
                    {isUsed ? (
                      /* ── Estado utilizado ── */
                      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"12px", padding:"10px 0" }}>
                        <div style={{ width:"64px", height:"64px", borderRadius:"50%", background:"rgba(48,209,88,0.1)", border:"2px solid rgba(48,209,88,0.3)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                          <CheckCircle2 size={32} color="#30D158"/>
                        </div>
                        <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"17px", fontWeight:800, color:"#30D158", textAlign:"center" }}>Cupón Utilizado</p>
                        <p style={{ fontSize:"11px", color:"#8E8EA0", textAlign:"center", lineHeight:1.5 }}>Este cupón ya fue escaneado<br/>y aplicado correctamente</p>
                        <p style={{ fontFamily:"monospace", fontSize:"11px", color:"#3A3A50", letterSpacing:"0.1em" }}>{c.code}</p>
                      </div>
                    ) : (
                      /* ── Estado con QR ── */
                      <>
                        <div style={{ background:"#FFFFFF", borderRadius:"16px", padding:"18px", margin:"0 auto 10px", maxWidth:"230px" }}>
                          <div style={{ display:"grid", gridTemplateColumns:"repeat(9,1fr)", gap:"3px", marginBottom:"10px" }}>
                            {Array.from({length:81},(_,idx)=>{
                              const corners=[[0,1,2,9,18,10,11,19,20],[6,7,8,15,16,17,24,25,26],[54,55,56,63,64,65,72,73,74]];
                              const isCorner=corners.some(g=>g.includes(idx));
                              const rand=((idx*7+13)%17)>9;
                              return <div key={idx} style={{ aspectRatio:"1", borderRadius:"1px", background:isCorner||rand?"#0B0B12":"transparent" }}/>;
                            })}
                          </div>
                          <div style={{ display:"flex", gap:"1px", height:"28px", alignItems:"stretch", marginBottom:"6px" }}>
                            {Array.from({length:36},(_,idx)=>(
                              <div key={idx} style={{ flex:((idx*3+7)%5)+1, background:((idx*11+3)%3)===0?"#ffffff":"#0B0B12" }}/>
                            ))}
                          </div>
                          <p style={{ textAlign:"center", fontFamily:"monospace", fontSize:"9px", color:"#0B0B12", fontWeight:700 }}>{c.code}</p>
                        </div>
                        <p style={{ fontSize:"11px", color:"#8E8EA0", textAlign:"center", marginBottom:"12px" }}>Presenta en <strong style={{ color:"#F2F2F7" }}>secretaría o tienda</strong> para aplicar</p>
                        <button
                          onClick={(e)=>markUsed(i,e)}
                          style={{ width:"100%", padding:"12px", borderRadius:"13px", background:`linear-gradient(90deg,${c.color},${c.color}cc)`, border:"none", cursor:"pointer", boxShadow:`0 4px 16px ${c.color}44`, fontFamily:"'Barlow Condensed',sans-serif", fontSize:"16px", fontWeight:900, color:"#fff", textTransform:"uppercase", letterSpacing:"0.06em", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px" }}
                        >
                          <CheckCircle2 size={18} color="#fff"/>
                          Marcar como Utilizado
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div style={{ height:"100px" }}/>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MIS PLANES — DETALLE DE PLAN GUARDADO
═══════════════════════════════════════════════════════════ */
function MiPlanDetalleScreen({ nav, plan, onStartWorkout }: { nav:(r:Route)=>void; plan:SavedPlan; onStartWorkout:(exs:PlanExercise[])=>void }) {
  const [activeDay, setActiveDay] = useState(1);
  const curDay = plan.planDays.find(d=>d.dia===activeDay) ?? plan.planDays[0];
  const trainDays = plan.planDays.filter(d=>!d.isRest).length;
  const restDays  = plan.planDays.filter(d=>d.isRest).length;

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
      <BackHeader title={plan.name} subtitle={`${plan.days} días · ${trainDays} entrenos · ${restDays} descansos`} onBack={()=>nav("rutina-categoria")}/>

      {/* Plan metadata */}
      <div style={{ padding:"10px 24px 0", flexShrink:0 }}>
        <div style={{ display:"flex", gap:"8px" }}>
          {[
            { label: plan.type==="ia"?"Plan IA":"Manual", color:"#7B61FF" },
            ...(plan.muscle ? [{ label:plan.muscle, color:"#FF4D00" }] : []),
            ...(plan.freq   ? [{ label:`${plan.freq}x/sem`, color:"#30D158" }] : []),
            ...(plan.duration ? [{ label:`${plan.duration}min/ses`, color:"#FFD60A" }] : []),
          ].map(({label,color})=>(
            <span key={label} style={{ fontSize:"10px", fontWeight:700, color, background:`${color}18`, border:`1px solid ${color}33`, borderRadius:"8px", padding:"3px 9px" }}>{label}</span>
          ))}
        </div>
        {/* Progress bar */}
        <div style={{ marginTop:"10px", height:"4px", background:"rgba(255,255,255,0.07)", borderRadius:"2px", overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${Math.round(((activeDay-1)/plan.days)*100)}%`, background:"linear-gradient(90deg,#FF4D00,#FF7A00)", borderRadius:"2px" }}/>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:"3px" }}>
          <span style={{ fontSize:"9px", color:"#8E8EA0" }}>Día {activeDay-1} completados</span>
          <span style={{ fontSize:"9px", color:"#FF4D00", fontWeight:600 }}>{Math.round(((activeDay-1)/plan.days)*100)}%</span>
        </div>
      </div>

      {/* Day selector strip */}
      <div style={{ flexShrink:0, overflowX:"auto", scrollbarWidth:"none", padding:"10px 24px 0", display:"flex", gap:"6px" }}>
        {plan.planDays.map(d=>{
          const isAct = d.dia===activeDay;
          const isRest = d.isRest;
          return (
            <button key={d.dia} onClick={()=>setActiveDay(d.dia)} style={{ flexShrink:0, width:"40px", height:"44px", borderRadius:"12px", background:isAct?(isRest?"rgba(123,97,255,0.25)":"rgba(255,77,0,0.2)"):"#141420", border:isAct?(isRest?"1.5px solid rgba(123,97,255,0.5)":"1.5px solid rgba(255,77,0,0.5)"):"1px solid rgba(255,255,255,0.07)", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"1px" }}>
              <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"14px", fontWeight:800, color:isAct?(isRest?"#7B61FF":"#FF4D00"):"#C4C4D0" }}>D{d.dia}</span>
              <span style={{ fontSize:"7px", color:isRest?"#7B61FF":"#30D158" }}>{isRest?"DESC":"ENT"}</span>
            </button>
          );
        })}
      </div>

      {/* Day content */}
      <div style={{ flex:1, overflowY:"auto", scrollbarWidth:"none", padding:"12px 24px 0" }}>
        {curDay?.isRest ? (
          <div style={{ textAlign:"center", padding:"40px 0", color:"#8E8EA0" }}>
            <div style={{ fontSize:"48px", marginBottom:"12px" }}>😴</div>
            <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"20px", fontWeight:800, color:"#C4C4D0", marginBottom:"6px" }}>Día de Descanso</p>
            <p style={{ fontSize:"12px" }}>Recuperación activa · Hidratación · Sueño</p>
          </div>
        ) : curDay && curDay.exercises.length > 0 ? (
          <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
            {curDay.exercises.map((ex,i)=>(
              <div key={i} style={{ background:"#141420", borderRadius:"14px", border:"1px solid rgba(255,255,255,0.07)", padding:"13px 14px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"8px" }}>
                  <div style={{ width:"4px", height:"28px", borderRadius:"2px", background:"linear-gradient(180deg,#FF4D00,#FF7A00)", flexShrink:0 }}/>
                  <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"16px", fontWeight:800, color:"#F2F2F7" }}>{ex.name}</p>
                </div>
                <div style={{ display:"flex", gap:"8px" }}>
                  {[{l:"Series",v:ex.series},{l:"Reps",v:ex.reps},{l:"Desc. (s)",v:ex.rest}].map(({l,v})=>(
                    <div key={l} style={{ flex:1, background:"#0B0B12", borderRadius:"10px", padding:"7px", textAlign:"center" }}>
                      <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"18px", fontWeight:900, color:"#FF4D00" }}>{v}</p>
                      <p style={{ fontSize:"8px", color:"#8E8EA0", marginTop:"2px", fontWeight:600 }}>{l}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign:"center", padding:"40px 0", color:"#8E8EA0" }}>
            <div style={{ fontSize:"36px", marginBottom:"12px" }}>🏋️</div>
            <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"16px", fontWeight:700, color:"#C4C4D0", marginBottom:"6px" }}>Sin ejercicios registrados</p>
            <p style={{ fontSize:"12px" }}>Este día no tiene ejercicios asignados</p>
          </div>
        )}
        <div style={{ height:"100px" }}/>
      </div>

      {/* Start button */}
      <div style={{ padding:"10px 24px 16px", flexShrink:0 }}>
        <button
          onClick={()=>{
            const dayData = plan.planDays.find(d=>d.dia===activeDay);
            const exs = (dayData && !dayData.isRest) ? dayData.exercises : DEFAULT_WORKOUT;
            onStartWorkout(exs);
          }}
          style={{ width:"100%", padding:"14px", borderRadius:"16px", background:"linear-gradient(90deg,#FF4D00,#FF7A00)", border:"none", cursor:"pointer", boxShadow:"0 4px 20px rgba(255,77,0,0.4)", display:"flex", alignItems:"center", justifyContent:"center", gap:"10px" }}
        >
          <PlayCircle size={20} color="#fff"/>
          <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"17px", fontWeight:900, color:"#fff", textTransform:"uppercase" }}>Comenzar — Día {activeDay}</span>
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PLAN MANUAL
═══════════════════════════════════════════════════════════ */
type Exercise = { name:string;series:string;reps:string;rest:string };
const ALL_EXERCISES = [
  { cat:"🦵 Tren Inferior", items:["Sentadilla Libre con Barra","Sentadilla Frontal","Prensa de Piernas a 45°","Sentadilla Hack","Extensiones de Cuádriceps","Zancadas Caminando","Sentadilla Búlgara","Sentadilla Goblet","Sissy Squat","Peso Muerto Rumano","Curl de Piernas Tumbado","Curl de Piernas Sentado","Good Mornings","Glute Ham Raise","Hip Thrust","Puente de Glúteos","Patada de Glúteo en Polea","Abducción de Cadera","Monster Walks con Banda","Elevación de Talones De Pie","Elevación de Talones Sentado","Elevación de Talones en Prensa"] },
  { cat:"💪 Empujes (Pecho, Hombros, Tríceps)", items:["Press de Banca Plano","Press de Banca Inclinado","Press de Banca Declinado","Press con Mancuernas Plano","Press con Mancuernas Inclinado","Aperturas en Banco Plano","Aperturas en Banco Inclinado","Cruce de Poleas Altas","Cruce de Poleas Bajas","Pec Deck / Contractor","Press de Pecho en Máquina","Fondos en Paralelas para Pecho","Flexiones de Pecho","Press Militar De Pie","Press Arnold","Press de Hombros Sentado","Elevaciones Laterales","Elevaciones Laterales en Polea","Elevaciones Frontales","Pájaros / Rear Delt","Reverse Pec Deck","Face Pull","Remo al Mentón","Extensiones de Tríceps Pushdown","Press Francés","Extensión Tras Nuca","Fondos entre Bancos","Press Agarre Cerrado","Patada de Tríceps"] },
  { cat:"🦅 Tracciones (Espalda y Bíceps)", items:["Dominadas Pull-ups","Chin-ups","Jalón al Pecho","Jalón Agarre Cerrado","Remo con Barra Pendlay","Remo Agarre Supino","Remo con Mancuerna","Remo en T-Bar","Remo Sentado en Polea","Pull Over Brazos Rígidos","Remo en Máquina","Encogimientos de Hombros","Peso Muerto Convencional","Curl con Barra EZ","Curl Alterno con Mancuernas","Curl Inclinado","Curl Predicador","Curl Martillo","Curl Martillo en Polea","Curl Concentrado","Curl Doble en Polea Alta","Curl Inverso","Flexión / Extensión de Muñeca"] },
  { cat:"⚡ Core y Estabilizadores", items:["Plancha Abdominal","Plancha Lateral","Crunches Abdominales","Crunches en Polea Alta","Elevaciones de Piernas Colgado","Elevaciones de Rodillas Silla","Ab Wheel Rollouts","Giros Rusos","Leñador en Polea","Hiperextensiones Lumbares","Dead Bug","Bird Dog"] },
  { cat:"🏃 Cardiovascular y Funcional", items:["Cinta de Correr","Bicicleta Estática","Elíptica","Escaladora / Stairmaster","Remo Indoor","AirBike","Saltar la Cuerda","Burpees","Kettlebell Swings","Wall Balls","Sled Push"] },
];

function PlanManualScreen({ nav, onSave }: { nav:(r:Route)=>void; onSave:(plan:SavedPlan)=>void }) {
  const [totalDays, setTotalDays] = useState(4);
  const [activeDay, setActiveDay] = useState(1);
  const [restDays,  setRestDays]  = useState<Set<number>>(new Set());
  // exercises per day: Record<dayNum, Exercise[]>
  const [dayExs, setDayExs] = useState<Record<number, Exercise[]>>({ 1:[] });
  const [query,  setQuery]  = useState("");
  const [showPicker, setShowPicker] = useState(false);

  function ensureDay(d: number) {
    setDayExs(p => p[d] ? p : { ...p, [d]: [] });
  }
  function setDay(d: number) { setActiveDay(d); ensureDay(d); setShowPicker(false); setQuery(""); }

  function addEx(name: string) {
    setDayExs(p => ({ ...p, [activeDay]: [...(p[activeDay]??[]), { name, series:"3", reps:"10", rest:"60" }] }));
  }
  function updEx(i:number, f:keyof Exercise, v:string) {
    setDayExs(p => ({ ...p, [activeDay]: (p[activeDay]??[]).map((e,idx)=>idx===i?{...e,[f]:v}:e) }));
  }
  function delEx(i:number) {
    setDayExs(p => ({ ...p, [activeDay]: (p[activeDay]??[]).filter((_,idx)=>idx!==i) }));
  }
  function toggleRest(d:number) {
    setRestDays(p => { const n=new Set(p); n.has(d)?n.delete(d):n.add(d); return n; });
  }
  function changeTotalDays(n: number) {
    const clamped = Math.max(1, n);
    setTotalDays(clamped);
    if (activeDay > clamped) setDay(clamped);
  }

  const isRest = restDays.has(activeDay);
  const exs = dayExs[activeDay] ?? [];
  const filteredCats = ALL_EXERCISES.map(c => ({
    ...c,
    items: c.items.filter(it => it.toLowerCase().includes(query.toLowerCase())),
  })).filter(c => c.items.length > 0);

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
      <BackHeader title="Nuevo Plan Personalizado" subtitle="Diseña tu rutina desde cero" onBack={()=>nav("planes")}/>

      {/* Step 1: total days */}
      <div style={{ padding:"12px 24px 0", flexShrink:0 }}>
        <p style={{ fontSize:"11px", color:"#8E8EA0", fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:"8px" }}>Cantidad de días de entrenamiento</p>
        <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
          <button onClick={()=>changeTotalDays(totalDays-1)} style={{ width:"36px", height:"36px", borderRadius:"10px", background:"#141420", border:"1px solid rgba(255,255,255,0.1)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><Minus size={16} color="#8E8EA0"/></button>
          <div style={{ flex:1, height:"36px", background:"#141420", borderRadius:"10px", border:"1px solid rgba(255,77,0,0.3)", display:"flex", alignItems:"center", justifyContent:"center", gap:"6px" }}>
            <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"22px", fontWeight:900, color:"#FF4D00" }}>{totalDays}</span>
            <span style={{ fontSize:"12px", color:"#8E8EA0" }}>días en total</span>
          </div>
          <button onClick={()=>changeTotalDays(totalDays+1)} style={{ width:"36px", height:"36px", borderRadius:"10px", background:"#141420", border:"1px solid rgba(255,255,255,0.1)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><Plus size={16} color="#8E8EA0"/></button>
        </div>
      </div>

      {/* Step 2: Day tabs */}
      <div style={{ padding:"10px 24px 0", flexShrink:0 }}>
        <p style={{ fontSize:"11px", color:"#8E8EA0", fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:"8px" }}>Días de entrenamiento</p>
        <div style={{ display:"flex", gap:"6px", overflowX:"auto", scrollbarWidth:"none" }}>
          {Array.from({length:totalDays},(_,i)=>i+1).map(d => {
            const isA = d === activeDay; const isR = restDays.has(d);
            return (
              <button key={d} onClick={()=>setDay(d)} style={{ flexShrink:0, minWidth:"44px", height:"44px", borderRadius:"12px", border:isA?"2px solid #FF4D00":isR?"1.5px solid rgba(48,209,88,0.3)":"1.5px solid rgba(255,255,255,0.1)", background:isA?"linear-gradient(135deg,#FF4D00,#FF7A00)":isR?"rgba(48,209,88,0.08)":"#141420", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
                <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"14px", fontWeight:900, color:isA?"#fff":isR?"#30D158":"#8E8EA0", lineHeight:1 }}>{d}</span>
                {isR && <span style={{ fontSize:"7px", color:"#30D158", fontWeight:700 }}>DESC.</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Rest toggle */}
      <div style={{ padding:"8px 24px 0", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div>
          <p style={{ fontSize:"13px", color:"#F2F2F7", fontWeight:700 }}>Día {activeDay}</p>
          <p style={{ fontSize:"11px", color:"#8E8EA0" }}>{isRest ? "Día de descanso — sin ejercicios" : `${exs.length} ejercicio${exs.length!==1?"s":""} añadidos`}</p>
        </div>
        <button onClick={()=>toggleRest(activeDay)} style={{ display:"flex", alignItems:"center", gap:"6px", padding:"6px 14px", borderRadius:"20px", border: isRest?"1.5px solid rgba(48,209,88,0.5)":"1.5px solid rgba(255,255,255,0.12)", background:isRest?"rgba(48,209,88,0.1)":"rgba(255,255,255,0.04)", cursor:"pointer" }}>
          <span style={{ fontSize:"14px" }}>{isRest?"🛌":"💪"}</span>
          <span style={{ fontSize:"12px", fontWeight:700, color:isRest?"#30D158":"#8E8EA0" }}>{isRest?"Descanso":"Activo"}</span>
        </button>
      </div>

      {/* Exercise search & list — only when not rest */}
      {!isRest && (
        <>
          <div style={{ padding:"8px 24px 0", flexShrink:0 }}>
            <div style={{ display:"flex", alignItems:"center", gap:"10px", background:"#141420", borderRadius:"12px", border:"1px solid rgba(255,255,255,0.08)", padding:"0 14px" }}>
              <Search size={15} color="#8E8EA0"/>
              <input
                value={query}
                onChange={e=>{ setQuery(e.target.value); setShowPicker(true); }}
                onFocus={()=>setShowPicker(true)}
                placeholder="Buscar ejercicio para añadir..."
                style={{ flex:1, background:"none", border:"none", outline:"none", color:"#F2F2F7", fontSize:"13px", fontFamily:"'Barlow',sans-serif", padding:"11px 0" }}
              />
              {(query||showPicker) && <button onClick={()=>{ setQuery(""); setShowPicker(false); }} style={{ background:"none", border:"none", cursor:"pointer", padding:"4px" }}><X size={14} color="#8E8EA0"/></button>}
            </div>
          </div>

          {showPicker && (
            <div style={{ flexShrink:0, maxHeight:"180px", overflowY:"auto", scrollbarWidth:"none", margin:"4px 24px 0", background:"#141420", borderRadius:"14px", border:"1px solid rgba(255,255,255,0.08)" }}>
              {filteredCats.map(cat=>(
                <div key={cat.cat}>
                  <p style={{ fontSize:"9px", color:"#FF4D00", fontWeight:700, textTransform:"uppercase", padding:"8px 12px 4px", letterSpacing:"0.06em" }}>{cat.cat}</p>
                  {cat.items.map(item=>{
                    const already = exs.some(e=>e.name===item);
                    return (
                      <button key={item} onClick={()=>{ if(!already){ addEx(item); setQuery(""); setShowPicker(false); } }} style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"7px 12px", background:"none", border:"none", cursor:already?"default":"pointer", borderTop:"1px solid rgba(255,255,255,0.04)" }}>
                        <span style={{ fontSize:"12px", color:already?"#3A3A50":"#C4C4D0", textAlign:"left" }}>{item}</span>
                        {already ? <span style={{ fontSize:"9px", color:"#3A3A50" }}>ya añadido</span> : <Plus size={12} color="#FF4D00"/>}
                      </button>
                    );
                  })}
                </div>
              ))}
              {filteredCats.length === 0 && <p style={{ fontSize:"12px", color:"#5A5A70", padding:"14px 12px", textAlign:"center" }}>Sin resultados para "{query}"</p>}
            </div>
          )}
        </>
      )}

      {/* Exercise cards */}
      <div style={{ flex:1, overflowY:"auto", scrollbarWidth:"none", padding:"8px 24px 0" }}>
        {isRest ? (
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"10px", paddingTop:"32px" }}>
            <span style={{ fontSize:"48px" }}>🛌</span>
            <p style={{ fontSize:"16px", color:"#8E8EA0", fontWeight:600, textAlign:"center" }}>Día de descanso activo</p>
            <p style={{ fontSize:"12px", color:"#5A5A70", textAlign:"center" }}>Estiramiento, movilidad o caminata ligera</p>
          </div>
        ) : exs.length === 0 ? (
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"8px", paddingTop:"28px" }}>
            <Dumbbell size={32} color="#3A3A50"/>
            <p style={{ fontSize:"13px", color:"#5A5A70", textAlign:"center" }}>Busca y añade ejercicios para el Día {activeDay}</p>
          </div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
            {exs.map((ex,i)=>(
              <div key={i} style={{ background:"#141420", borderRadius:"14px", border:"1px solid rgba(255,255,255,0.06)", padding:"11px 14px" }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"8px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                    <div style={{ width:"4px", height:"26px", borderRadius:"2px", background:"linear-gradient(180deg,#FF4D00,#FF7A00)", flexShrink:0 }}/>
                    <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"15px", fontWeight:700, color:"#F2F2F7" }}>{ex.name}</span>
                  </div>
                  <button onClick={()=>delEx(i)} style={{ width:"24px", height:"24px", borderRadius:"7px", background:"rgba(255,59,48,0.1)", border:"1px solid rgba(255,59,48,0.2)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}><X size={11} color="#FF3B30"/></button>
                </div>
                <div style={{ display:"flex", gap:"8px" }}>
                  {(["series","reps","rest"] as const).map(f=>{const labels={series:"Series",reps:"Reps",rest:"Desc.(s)"}; return (
                    <div key={f} style={{ flex:1 }}>
                      <p style={{ fontSize:"9px", color:"#8E8EA0", fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:"3px" }}>{labels[f]}</p>
                      <input type="number" value={ex[f]} onChange={e=>updEx(i,f,e.target.value)} style={{ width:"100%", padding:"6px 8px", background:"#0B0B12", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"9px", color:"#F2F2F7", fontSize:"14px", fontWeight:700, fontFamily:"'Barlow Condensed',sans-serif", textAlign:"center", outline:"none" }}/>
                    </div>
                  );})}
                </div>
              </div>
            ))}
          </div>
        )}
        <div style={{ height:"80px" }}/>
      </div>
      <div style={{ padding:"10px 24px 16px", flexShrink:0 }}>
        <button onClick={()=>{
          const planDays: PlanDay[] = Array.from({length:totalDays},(_,i)=>{
            const d=i+1;
            return { dia:d, isRest:restDays.has(d), exercises:(dayExs[d]??[]).map(e=>({name:e.name,series:e.series,reps:e.reps,rest:e.rest})) };
          });
          onSave({ name:`Mi Rutina (${totalDays} días)`, days:totalDays, type:"manual", planDays });
          nav("planes");
        }} style={{ width:"100%", padding:"14px 20px", borderRadius:"16px", background:"linear-gradient(90deg,#FF4D00,#FF7A00)", border:"none", cursor:"pointer", boxShadow:"0 4px 24px rgba(255,77,0,0.45)" }}>
          <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"17px", fontWeight:900, color:"#fff", textTransform:"uppercase" }}>Guardar Rutina</span>
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PLAN IA
═══════════════════════════════════════════════════════════ */
function PlanIAScreen({ nav, onSave }: { nav:(r:Route)=>void; onSave:(plan:SavedPlan)=>void }) {
  const [muscle,    setMuscle]    = useState("Balanceado");
  const [freqDays,  setFreqDays]  = useState(4);
  const [duration,  setDuration]  = useState(60);
  const [totalDays, setTotalDays] = useState(28);
  const [equipment, setEquipment] = useState<Set<string>>(new Set(["Mancuernas","Barras","Máquinas de Polea","Máquinas Articuladas"]));
  const [processing, setProcessing] = useState(false);
  const [done,      setDone]      = useState(false);

  function handle(){ if(processing||done)return; setProcessing(true); setTimeout(()=>{ setProcessing(false); setDone(true); },3000); }
  function toggleEq(e:string){ setEquipment(p=>{ const n=new Set(p); n.has(e)?n.delete(e):n.add(e); return n; }); }

  const muscles=[{id:"Balanceado",emoji:"⚖️"},{id:"Brazos",emoji:"💪"},{id:"Pecho/Espalda",emoji:"🦅"},{id:"Piernas/Glúteos",emoji:"🦵"},{id:"Hombros",emoji:"⬆️"},{id:"Core",emoji:"⚡"}];
  const equipList=["Mancuernas","Barras","Máquinas de Polea","Peso Corporal","Máquinas Articuladas","Kettlebells","Bandas Elásticas"];

  const durPct = ((duration-30)/(120-30))*100;

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
      <BackHeader title="Rutina con IA" subtitle="Configura y genera tu plan inteligente" onBack={()=>nav("planes")}/>
      <div style={{ flex:1, overflowY:"auto", scrollbarWidth:"none", padding:"0 24px" }}>

        {/* IA banner */}
        <div style={{ marginTop:"14px", background:"#141420", borderRadius:"14px", border:"1px solid rgba(123,97,255,0.2)", padding:"12px 14px", display:"flex", alignItems:"center", gap:"10px" }}>
          <div style={{ width:"32px", height:"32px", borderRadius:"10px", background:"rgba(123,97,255,0.15)", border:"1px solid rgba(123,97,255,0.3)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}><Bot size={16} color="#7B61FF"/></div>
          <div>
            <p style={{ fontSize:"12px", fontWeight:600, color:"#C4C4D0" }}>Motor de IA analizará: <span style={{ color:"#7B61FF" }}>altura · peso · historial · nivel</span></p>
            <p style={{ fontSize:"10px", color:"#8E8EA0", marginTop:"2px" }}>Carlos Rodríguez · Nivel Avanzado · 78 kg</p>
          </div>
        </div>

        {/* Total days */}
        <div style={{ marginTop:"16px" }}>
          <p style={{ fontSize:"11px", color:"#8E8EA0", fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:"8px" }}>Duración del plan (días totales)</p>
          <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
            <button onClick={()=>setTotalDays(d=>Math.max(7,d-7))} style={{ width:"34px", height:"34px", borderRadius:"10px", background:"#141420", border:"1px solid rgba(255,255,255,0.1)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><Minus size={14} color="#8E8EA0"/></button>
            <div style={{ flex:1, height:"34px", background:"#141420", borderRadius:"10px", border:"1px solid rgba(123,97,255,0.3)", display:"flex", alignItems:"center", justifyContent:"center", gap:"6px" }}>
              <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"20px", fontWeight:900, color:"#7B61FF" }}>{totalDays}</span>
              <span style={{ fontSize:"11px", color:"#8E8EA0" }}>días · {totalDays/7} semana{totalDays/7!==1?"s":""}</span>
            </div>
            <button onClick={()=>setTotalDays(d=>Math.min(84,d+7))} style={{ width:"34px", height:"34px", borderRadius:"10px", background:"#141420", border:"1px solid rgba(255,255,255,0.1)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><Plus size={14} color="#8E8EA0"/></button>
          </div>
        </div>

        {/* Frequency chips */}
        <div style={{ marginTop:"14px" }}>
          <p style={{ fontSize:"11px", color:"#8E8EA0", fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:"8px" }}>Días disponibles a la semana</p>
          <div style={{ display:"flex", gap:"6px", flexWrap:"wrap" }}>
            {[2,3,4,5,6].map(n=>{const isA=freqDays===n; return (
              <button key={n} onClick={()=>setFreqDays(n)} style={{ padding:"7px 16px", borderRadius:"20px", border:isA?"1.5px solid #7B61FF":"1.5px solid rgba(255,255,255,0.1)", background:isA?"rgba(123,97,255,0.2)":"#141420", cursor:"pointer" }}>
                <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"14px", fontWeight:800, color:isA?"#C4B8FF":"#8E8EA0" }}>{n} días</span>
              </button>
            );})}
          </div>
        </div>

        {/* Duration slider */}
        <div style={{ marginTop:"14px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:"8px" }}>
            <p style={{ fontSize:"11px", color:"#8E8EA0", fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase" }}>Tiempo máx. por sesión</p>
            <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"20px", fontWeight:800, color:"#7B61FF" }}>{duration} min</span>
          </div>
          <div style={{ position:"relative", height:"6px", borderRadius:"3px", background:"rgba(255,255,255,0.08)" }}>
            <div style={{ position:"absolute", left:0, top:0, bottom:0, borderRadius:"3px", background:"linear-gradient(90deg,#7B61FF,#FF4D00)", width:`${durPct}%` }}/>
            <input type="range" min={30} max={120} step={15} value={duration} onChange={e=>setDuration(Number(e.target.value))} style={{ position:"absolute", inset:0, width:"100%", opacity:0, cursor:"pointer", height:"100%" }}/>
            <div style={{ position:"absolute", top:"50%", left:`${durPct}%`, transform:"translate(-50%,-50%)", width:"18px", height:"18px", borderRadius:"50%", background:"linear-gradient(135deg,#7B61FF,#FF4D00)", border:"2.5px solid #0B0B12", pointerEvents:"none" }}/>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:"4px" }}>
            <span style={{ fontSize:"9px", color:"#3A3A50" }}>30 min</span>
            <span style={{ fontSize:"9px", color:"#3A3A50" }}>120 min</span>
          </div>
        </div>

        {/* Equipment chips */}
        <div style={{ marginTop:"14px" }}>
          <p style={{ fontSize:"11px", color:"#8E8EA0", fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:"8px" }}>¿Con qué equipamiento entrenas?</p>
          <div style={{ display:"flex", gap:"6px", flexWrap:"wrap" }}>
            {equipList.map(e=>{ const isA=equipment.has(e); return (
              <button key={e} onClick={()=>toggleEq(e)} style={{ display:"flex", alignItems:"center", gap:"5px", padding:"6px 12px", borderRadius:"20px", border:isA?"1.5px solid rgba(123,97,255,0.6)":"1.5px solid rgba(255,255,255,0.1)", background:isA?"rgba(123,97,255,0.18)":"#141420", cursor:"pointer" }}>
                {isA && <CheckCircle2 size={11} color="#7B61FF"/>}
                <span style={{ fontSize:"11px", fontWeight:700, color:isA?"#C4B8FF":"#8E8EA0" }}>{e}</span>
              </button>
            );})}
          </div>
        </div>

        {/* Muscle focus */}
        <div style={{ marginTop:"14px" }}>
          <p style={{ fontSize:"11px", color:"#8E8EA0", fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:"8px" }}>Grupo muscular a priorizar</p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"6px" }}>
            {muscles.map(({id,emoji})=>{ const isA=muscle===id; return (
              <button key={id} onClick={()=>setMuscle(id)} style={{ padding:"10px 6px", borderRadius:"14px", cursor:"pointer", background:isA?"linear-gradient(135deg,rgba(123,97,255,0.25),rgba(255,77,0,0.1))":"#141420", border:isA?"1.5px solid rgba(123,97,255,0.5)":"1px solid rgba(255,255,255,0.07)", display:"flex", flexDirection:"column", alignItems:"center", gap:"3px" }}>
                <span style={{ fontSize:"18px" }}>{emoji}</span>
                <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"11px", fontWeight:800, color:isA?"#C4B8FF":"#8E8EA0", textAlign:"center", lineHeight:1.2 }}>{id}</span>
              </button>
            );})}
          </div>
        </div>

        {/* Processing orb */}
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"12px", marginTop:"20px" }}>
          <div style={{ position:"relative", width:"130px", height:"130px", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <div style={{ position:"absolute", width:"130px", height:"130px", borderRadius:"50%", border:"1px solid rgba(123,97,255,0.12)", animation:processing?"spin 8s linear infinite":"none" }}/>
            <div style={{ position:"absolute", width:"106px", height:"106px", borderRadius:"50%", border:"1px solid rgba(255,77,0,0.1)", animation:processing?"spin 5s linear infinite reverse":"none" }}/>
            <div style={{ width:"84px", height:"84px", borderRadius:"50%", background:done?"linear-gradient(135deg,rgba(48,209,88,0.2),rgba(48,209,88,0.05))":"linear-gradient(135deg,rgba(123,97,255,0.2),rgba(255,77,0,0.1))", border:done?"2px solid rgba(48,209,88,0.4)":"2px solid rgba(123,97,255,0.3)", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:"4px" }}>
              {done?<CheckCircle2 size={28} color="#30D158" style={{ filter:"drop-shadow(0 0 8px rgba(48,209,88,0.8))" }}/>:<Bot size={28} color={processing?"#C4B8FF":"#7B61FF"}/>}
              {processing&&<span style={{ fontSize:"7px", color:"#7B61FF", fontWeight:600 }}>ANALIZANDO</span>}
            </div>
          </div>
          <div style={{ textAlign:"center", width:"100%" }}>
            <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"13px", fontWeight:700, color:done?"#30D158":processing?"#C4B8FF":"#8E8EA0" }}>
              {done?"¡Rutina estructurada!":processing?"Generando tu plan personalizado...":"Motor de IA en espera"}
            </p>
            <div style={{ width:"100%", height:"4px", background:"rgba(255,255,255,0.06)", borderRadius:"2px", marginTop:"6px", overflow:"hidden" }}>
              <div style={{ height:"100%", borderRadius:"2px", background:"linear-gradient(90deg,#7B61FF,#FF4D00)", width:done?"100%":processing?"70%":"0%", transition:"width 2.8s ease" }}/>
            </div>
          </div>
        </div>
        <div style={{ height:"16px" }}/>
      </div>

      <div style={{ padding:"10px 24px 16px", flexShrink:0 }}>
        {done
          ? <button onClick={()=>{
              // Generate realistic IA plan days based on settings
              const FOCUS_EXMAP: Record<string, string[][]> = {
                "Balanceado":     [["Press de Banca","4","10","60"],["Sentadilla Libre","4","8","90"],["Jalón al Pecho","3","12","60"],["Plancha Abdominal","3","60s","30"]],
                "Brazos":         [["Curl con Barra","4","12","60"],["Press Francés","4","10","60"],["Martillo Alterno","3","15","45"],["Extensión en Polea","3","12","60"]],
                "Pecho/Espalda":  [["Press de Banca Plano","4","10","90"],["Dominadas","4","8","90"],["Press Inclinado","3","12","60"],["Remo con Barra","3","10","60"]],
                "Piernas/Glúteos":[["Sentadilla Libre","4","8","90"],["Hip Thrust","4","12","60"],["Prensa de Piernas","3","15","60"],["Curl Femoral","3","12","60"]],
                "Hombros":        [["Press Militar","4","8","90"],["Elevaciones Laterales","4","15","45"],["Face Pull","3","15","45"],["Press Arnold","3","10","60"]],
                "Core":           [["Plancha Abdominal","4","60s","30"],["Crunches en Polea","3","15","45"],["Ab Wheel Rollouts","3","12","60"],["Giros Rusos","3","20","45"]],
              };
              const exBase = FOCUS_EXMAP[muscle] ?? FOCUS_EXMAP["Balanceado"];
              const restInterval = Math.max(1, Math.round(7/freqDays));
              const planDays: PlanDay[] = Array.from({length:totalDays},(_,i)=>{
                const dia = i+1;
                const weekDay = i % 7;
                const isRest = weekDay >= freqDays;
                return { dia, isRest, exercises: isRest ? [] : exBase.map(e=>({name:e[0],series:e[1],reps:e[2],rest:e[3]})) };
              });
              onSave({ name:`Rutina IA — ${muscle} (${totalDays} días)`, days:totalDays, type:"ia", muscle, freq:freqDays, duration, planDays });
              nav("planes");
            }} style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px", padding:"14px", borderRadius:"16px", background:"linear-gradient(90deg,#30D158,#00C44D)", border:"none", cursor:"pointer" }}><CheckCircle2 size={18} color="#fff"/><span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"16px", fontWeight:900, color:"#fff", textTransform:"uppercase" }}>Ver mi Rutina Inteligente</span></button>
          : <button onClick={handle} disabled={processing} style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px", padding:"14px", borderRadius:"16px", background:processing?"linear-gradient(90deg,#3D2E70,#5A2200)":"linear-gradient(90deg,#7B61FF,#FF4D00)", border:"none", cursor:processing?"default":"pointer" }}>
              {processing?<RotateCcw size={15} color="#C4B8FF" style={{ animation:"spin 1s linear infinite" }}/>:<Sparkles size={15} color="#fff"/>}
              <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"14px", fontWeight:900, color:processing?"#8E8EA0":"#fff", textTransform:"uppercase" }}>{processing?"Estructurando...":"Generar mi Rutina Inteligente"}</span>
            </button>
        }
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   CHATBOT — NLP token engine
═══════════════════════════════════════════════════════════ */
type Msg = { role:"user"|"ai"; text:string };
const WELCOME: Msg = { role:"ai", text:"¡Hola! 👋 Soy tu Coach Virtual de Imperium Cross. Puedo ayudarte con técnica de ejercicios, nutrición, máquinas de la sala y productos del counter. ¿En qué te puedo ayudar?" };

function ChatbotScreen({ inGym, msgs, setMsgs }: { inGym:boolean; msgs:Msg[]; setMsgs:React.Dispatch<React.SetStateAction<Msg[]>> }) {
  const [input,   setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(()=>{ ref.current?.scrollIntoView({behavior:"smooth"}); },[msgs,loading]);

  async function send(text?: string) {
    const t = (text ?? input).trim();
    if (!t || loading) return;
    setMsgs(p => [...p, {role:"user", text:t}]);
    if (!text) setInput("");
    setLoading(true);
    try {
      const apiMessages = [...msgs, {role:"user" as const, text:t}]
        .map(m => ({ role: m.role === "ai" ? "assistant" as const : "user" as const, content: m.text }));
      const response = await chatWithCoach(apiMessages);
      setMsgs(p => [...p, {role:"ai", text:response}]);
    } catch {
      setMsgs(p => [...p, {role:"ai", text:"⚠️ Hubo un error al conectar con el coach. Intenta de nuevo."}]);
    } finally {
      setLoading(false);
    }
  }

  function render(text:string) {
    return text.split("\n").map((l,i) => {
      const parts = l.split(/(\*\*[^*]+\*\*)/g);
      const rendered = parts.map((part,j) => {
        if (part.startsWith("**") && part.endsWith("**"))
          return <strong key={j} style={{ color:"#F2F2F7" }}>{part.slice(2,-2)}</strong>;
        return part;
      });
      if (l.startsWith("• ")) return <div key={i} style={{ display:"flex", gap:"6px", marginBottom:"3px" }}><span style={{ color:"#FF4D00", flexShrink:0 }}>•</span><span>{rendered}</span></div>;
      if (l === "") return <div key={i} style={{ height:"5px" }}/>;
      return <span key={i}>{rendered}</span>;
    });
  }

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", position:"relative" }}>
      {/* Header */}
      <div style={{ flexShrink:0, padding:"14px 24px 12px", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
          <div style={{ width:"44px", height:"44px", borderRadius:"50%", background:"linear-gradient(135deg,#7B61FF,#FF4D00)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 0 20px rgba(123,97,255,0.45)", flexShrink:0 }}><Bot size={22} color="#fff"/></div>
          <div style={{ flex:1 }}>
            <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
              <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"20px", fontWeight:800, color:"#F2F2F7" }}>Coach Virtual IA</span>
              <div style={{ display:"flex", alignItems:"center", gap:"5px" }}>
                <div style={{ width:"7px", height:"7px", borderRadius:"50%", background:"#30D158", boxShadow:"0 0 6px rgba(48,209,88,0.8)", animation:"dotP 2s ease-in-out infinite" }}/>
                <span style={{ fontSize:"10px", color:"#30D158", fontWeight:600 }}>En Línea</span>
              </div>
            </div>
            <p style={{ fontSize:"11px", color:"#8E8EA0" }}>Técnica · Nutrición · Máquinas · Tienda</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex:1, overflowY:"auto", scrollbarWidth:"none", padding:"16px 16px 8px", display:"flex", flexDirection:"column", gap:"12px" }}>
        {msgs.map((m,i) => (
          <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:m.role==="user"?"flex-end":"flex-start", gap:"6px" }}>
            <div style={{ display:"flex", justifyContent:m.role==="user"?"flex-end":"flex-start", gap:"8px", alignItems:"flex-end" }}>
              {m.role==="ai" && (
                <div style={{ width:"28px", height:"28px", borderRadius:"50%", background:"linear-gradient(135deg,#7B61FF,#FF4D00)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <Bot size={14} color="#fff"/>
                </div>
              )}
              <div style={{ maxWidth:"75%", padding:"11px 14px", borderRadius:m.role==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px", background:m.role==="user"?"linear-gradient(135deg,#FF4D00,#FF7A00)":"#1C1C2A", border:m.role==="ai"?"1px solid rgba(123,97,255,0.18)":"none" }}>
                <div style={{ fontSize:"12.5px", color:m.role==="user"?"#fff":"#C4C4D0", lineHeight:1.6 }}>{render(m.text)}</div>
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display:"flex", alignItems:"flex-end", gap:"8px" }}>
            <div style={{ width:"28px", height:"28px", borderRadius:"50%", background:"linear-gradient(135deg,#7B61FF,#FF4D00)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}><Bot size={14} color="#fff"/></div>
            <div style={{ padding:"10px 14px", borderRadius:"18px 18px 18px 4px", background:"#1C1C2A", border:"1px solid rgba(123,97,255,0.18)" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                <div style={{ display:"flex", gap:"4px" }}>
                  {[0,1,2].map(d=><div key={d} style={{ width:"6px", height:"6px", borderRadius:"50%", background:"#7B61FF", animation:`dotP 1.2s ease-in-out ${d*0.2}s infinite` }}/>)}
                </div>
                <span style={{ fontSize:"11px", color:"#8E8EA0", fontStyle:"italic" }}>Pensando...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={ref}/>
      </div>

      {/* Input */}
      <div style={{ flexShrink:0, background:"#0B0B12", borderTop:"1px solid rgba(255,255,255,0.07)", padding:"10px 16px 0" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"10px", background:"#1C1C2A", borderRadius:"18px", border:`1.5px solid ${input.trim()?"rgba(255,77,0,0.45)":"rgba(255,255,255,0.08)"}`, padding:"0 8px 0 16px", minHeight:"50px", transition:"border-color 0.2s" }}>
          <input
            value={input}
            onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>{ if(e.key==="Enter"){ e.preventDefault(); send(); } }}
            placeholder="Escribe tu consulta..."
            style={{ flex:1, background:"none", border:"none", outline:"none", color:"#F2F2F7", fontSize:"13px", fontFamily:"'Barlow',sans-serif", lineHeight:"1.4", alignSelf:"center" }}
          />
          <button onClick={()=>send()} disabled={!input.trim()||loading} style={{ width:"38px", height:"38px", borderRadius:"12px", background:input.trim()&&!loading?"linear-gradient(135deg,#FF4D00,#FF7A00)":"rgba(255,255,255,0.06)", border:"none", cursor:input.trim()&&!loading?"pointer":"default", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all 0.2s" }}>
            <Send size={16} color={input.trim()&&!loading?"#fff":"#8E8EA0"}/>
          </button>
        </div>
        {input.trim() && <p style={{ fontSize:"10px", color:"#3A3A50", textAlign:"center", padding:"4px 0 2px" }}>Enter para enviar</p>}
        <div style={{ height:"110px" }}/>
      </div>
      <style>{`@keyframes dotP{0%,100%{opacity:0.3;transform:translateY(0)}50%{opacity:1;transform:translateY(-3px)}}`}</style>


    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PROFILE
═══════════════════════════════════════════════════════════ */
function ProfileScreen({ nav }: { nav:(r:Route)=>void }) {
  const options = [
    { icon:Edit3,       label:"Editar datos físicos y antropométricos", sub:"Actualiza tu perfil biométrico",  action:()=>nav("onboarding") },
    { icon:CreditCard,  label:"Métodos de Pago y Facturación",          sub:"Gestión de la tarjeta mensual",   action:()=>{} },
    { icon:ShieldCheck, label:"Seguridad de la Cuenta",                 sub:"Contraseña · Autenticación",      action:()=>nav("settings") },
  ];
  return (
    <div style={{ flex:1, overflowY:"auto", scrollbarWidth:"none" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 24px 0" }}>
        <h1 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"28px", fontWeight:800, color:"#F2F2F7" }}>Mi Perfil</h1>
        <button onClick={()=>nav("settings")} style={{ width:"40px", height:"40px", borderRadius:"50%", background:"#141420", border:"1px solid rgba(255,255,255,0.08)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
          <Settings size={18} color="#8E8EA0"/>
        </button>
      </div>
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"24px 24px 0" }}>
        <div style={{ position:"relative", marginBottom:"14px" }}>
          <div style={{ width:"90px", height:"90px", borderRadius:"50%", background:"linear-gradient(135deg,#FF4D00,#FF8C00)", display:"flex", alignItems:"center", justifyContent:"center", border:"3px solid rgba(255,77,0,0.35)", boxShadow:"0 0 28px rgba(255,77,0,0.35)", fontFamily:"'Barlow Condensed',sans-serif", fontSize:"28px", fontWeight:900, color:"#fff" }}>CR</div>
          <div style={{ position:"absolute", bottom:"2px", right:"2px", width:"22px", height:"22px", borderRadius:"50%", background:"#30D158", border:"2.5px solid #0B0B12", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <div style={{ width:"7px", height:"7px", borderRadius:"50%", background:"#fff" }}/>
          </div>
        </div>
        <h2 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"24px", fontWeight:800, color:"#F2F2F7", marginBottom:"4px" }}>Carlos Rodríguez</h2>
        <div style={{ display:"inline-flex", alignItems:"center", gap:"8px", padding:"5px 14px", background:"linear-gradient(90deg,rgba(255,214,10,0.12),rgba(255,77,0,0.08))", borderRadius:"20px", border:"1px solid rgba(255,214,10,0.25)" }}>
          <Star size={12} color="#FFD60A"/>
          <span style={{ fontSize:"12px", color:"#FFD60A", fontWeight:700 }}>Socio VIP</span>
          <span style={{ fontSize:"12px", color:"#8E8EA0" }}>· Activo hasta 15 Oct 2026</span>
        </div>
      </div>
      <div style={{ padding:"20px 24px 0" }}>
        <p style={{ fontSize:"11px", color:"#8E8EA0", fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:"10px" }}>Estado Antropométrico</p>
        <div style={{ display:"flex", gap:"10px" }}>
          {[{label:"Estatura",value:"175 cm"},{label:"Peso",value:"78 kg"},{label:"Nivel",value:"Avanzado"}].map(({label,value})=>(
            <div key={label} style={{ flex:1, background:"#141420", borderRadius:"16px", border:"1px solid rgba(255,255,255,0.07)", padding:"14px 10px", textAlign:"center" }}>
              <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"18px", fontWeight:800, color:"#FF4D00", lineHeight:1 }}>{value}</p>
              <p style={{ fontSize:"10px", color:"#8E8EA0", marginTop:"5px" }}>{label}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding:"16px 24px 0" }}>
        <div style={{ background:"linear-gradient(135deg,#141420,#1a0800)", borderRadius:"18px", border:"1px solid rgba(255,77,0,0.15)", padding:"16px" }}>
          <p style={{ fontSize:"11px", color:"#8E8EA0", fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:"12px" }}>Estadísticas del Socio</p>
          <div style={{ display:"flex", justifyContent:"space-between" }}>
            {[{label:"Sesiones",value:"24",color:"#FF4D00"},{label:"Racha",value:"8 días 🔥",color:"#FF6B35"},{label:"Puntos",value:"1,240",color:"#FFD60A"},{label:"Logros",value:"9",color:"#7B61FF"}].map(({label,value,color})=>(
              <div key={label} style={{ textAlign:"center" }}>
                <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"18px", fontWeight:900, color, lineHeight:1 }}>{value}</p>
                <p style={{ fontSize:"9px", color:"#8E8EA0", marginTop:"4px" }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ padding:"16px 24px 0" }}>
        <p style={{ fontSize:"11px", color:"#8E8EA0", fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:"10px" }}>Gestión de Cuenta</p>
        <div style={{ display:"flex", flexDirection:"column", gap:"6px" }}>
          {options.map(({icon:Icon,label,sub,action},i)=>(
            <button key={i} onClick={action} style={{ display:"flex", alignItems:"center", gap:"14px", background:"#141420", borderRadius:"16px", border:"1px solid rgba(255,255,255,0.06)", padding:"14px 16px", cursor:"pointer", textAlign:"left" }}>
              <div style={{ width:"40px", height:"40px", borderRadius:"12px", background:"rgba(255,77,0,0.08)", border:"1px solid rgba(255,77,0,0.15)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}><Icon size={18} color="#FF4D00"/></div>
              <div style={{ flex:1 }}>
                <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"15px", fontWeight:700, color:"#F2F2F7", lineHeight:1 }}>{label}</p>
                <p style={{ fontSize:"10px", color:"#8E8EA0", marginTop:"3px" }}>{sub}</p>
              </div>
              <ChevronRight size={16} color="#3A3A50"/>
            </button>
          ))}
        </div>
      </div>
      <div style={{ height:"100px" }}/>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SETTINGS
═══════════════════════════════════════════════════════════ */
function SettingsScreen({ nav }: { nav:(r:Route)=>void }) {
  const [darkMode,   setDarkMode]   = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [lang,       setLang]       = useState<"Español"|"English">("Español");
  const [twoFactor,  setTwoFactor]  = useState(false);

  function Toggle({ on, onToggle, color="FF4D00" }: { on:boolean; onToggle:()=>void; color?:string }) {
    return (
      <button onClick={onToggle} style={{ width:"46px", height:"26px", borderRadius:"13px", background:on?`#${color}`:"rgba(255,255,255,0.1)", border:`1.5px solid ${on?`#${color}`:"rgba(255,255,255,0.12)"}`, cursor:"pointer", padding:"2px", display:"flex", alignItems:"center", justifyContent:on?"flex-end":"flex-start", transition:"all 0.2s", flexShrink:0 }}>
        <div style={{ width:"20px", height:"20px", borderRadius:"50%", background:"#fff", boxShadow:"0 1px 4px rgba(0,0,0,0.3)" }}/>
      </button>
    );
  }

  function Row({ icon:Icon, label, sub, right, last=false }: { icon:React.ElementType; label:string; sub?:string; right:React.ReactNode; last?:boolean }) {
    return (
      <div style={{ display:"flex", alignItems:"center", gap:"14px", padding:"13px 16px", borderBottom:last?"none":"1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ width:"34px", height:"34px", borderRadius:"10px", background:"rgba(255,255,255,0.05)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}><Icon size={16} color="#8E8EA0"/></div>
        <div style={{ flex:1 }}>
          <p style={{ fontSize:"13px", color:"#F2F2F7", fontWeight:600 }}>{label}</p>
          {sub && <p style={{ fontSize:"10px", color:"#8E8EA0", marginTop:"2px" }}>{sub}</p>}
        </div>
        {right}
      </div>
    );
  }

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
      <BackHeader title="Configuración" subtitle="Preferencias del sistema" onBack={()=>nav("profile")}/>
      <div style={{ flex:1, overflowY:"auto", scrollbarWidth:"none", paddingTop:"16px" }}>
        {[{title:"Cuenta", rows:[
          { icon:Lock, label:"Cambiar Contraseña", sub:"Última actualización: hace 3 meses", right:<ChevronRight size={16} color="#3A3A50"/>, last:false },
          { icon:Mail, label:"Actualizar Correo",  sub:"carlos@mail.com",                   right:<ChevronRight size={16} color="#3A3A50"/>, last:false },
          { icon:ShieldCheck, label:"Verificación en Dos Pasos", sub:twoFactor?"Activado · SMS":"Desactivado", right:<Toggle on={twoFactor} onToggle={()=>setTwoFactor(v=>!v)} color="30D158"/>, last:true },
        ]},{title:"Preferencias de la App", rows:[
          { icon:Moon, label:"Modo Oscuro", sub:darkMode?"Tema oscuro activo":"Tema claro activo", right:<Toggle on={darkMode} onToggle={()=>setDarkMode(v=>!v)}/>, last:false },
          { icon:BellRing, label:"Notificaciones Push", sub:"Avisos de retos y rachas", right:<Toggle on={pushNotifs} onToggle={()=>setPushNotifs(v=>!v)}/>, last:false },
          { icon:Globe, label:"Idioma", sub:lang, right:
            <div style={{ display:"flex", background:"rgba(255,255,255,0.05)", borderRadius:"10px", overflow:"hidden" }}>
              {(["Español","English"] as const).map(l=>(
                <button key={l} onClick={()=>setLang(l)} style={{ padding:"5px 10px", border:"none", cursor:"pointer", background:lang===l?"rgba(255,77,0,0.25)":"transparent", color:lang===l?"#FF6B35":"#8E8EA0", fontSize:"11px", fontWeight:700, fontFamily:"'Barlow',sans-serif" }}>{l==="Español"?"ES":"EN"}</button>
              ))}
            </div>, last:true },
        ]},{title:"Privacidad y Legal", rows:[
          { icon:ShieldCheck, label:"Políticas de Privacidad",          sub:undefined, right:<ChevronRight size={16} color="#3A3A50"/>, last:false },
          { icon:ClipboardList, label:"Términos del Servicio del Gimnasio", sub:undefined, right:<ChevronRight size={16} color="#3A3A50"/>, last:true },
        ]}].map(({title,rows})=>(
          <div key={title} style={{ marginBottom:"6px" }}>
            <p style={{ fontSize:"11px", color:"#8E8EA0", fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase", padding:"0 24px", marginBottom:"8px" }}>{title}</p>
            <div style={{ marginLeft:"24px", marginRight:"24px", background:"#141420", borderRadius:"18px", border:"1px solid rgba(255,255,255,0.06)", overflow:"hidden" }}>
              {rows.map((r,i)=><Row key={i} icon={r.icon} label={r.label} sub={r.sub} right={r.right} last={r.last}/>)}
            </div>
          </div>
        ))}
        <div style={{ padding:"8px 24px 0" }}>
          <button onClick={()=>nav("login")} style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:"10px", padding:"14px 20px", borderRadius:"16px", background:"rgba(255,59,48,0.08)", border:"1.5px solid rgba(255,59,48,0.25)", cursor:"pointer" }}>
            <LogOut size={18} color="#FF3B30"/>
            <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"17px", fontWeight:800, color:"#FF3B30", textTransform:"uppercase" }}>🚪 Cerrar Sesión</span>
          </button>
        </div>
        <p style={{ textAlign:"center", fontSize:"11px", color:"#3A3A50", padding:"16px 24px 28px" }}>Versión v1.4.2 · Imperium Cross IA</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ROOT
═══════════════════════════════════════════════════════════ */
export default function App() {
  const [history,      setHistory]     = useState<Route[]>(["login"]);
  const [selCategory,  setSelCategory] = useState("");
  const [selProgram,   setSelProgram]  = useState("");
  const [savedPlans,    setSavedPlans]  = useState<SavedPlan[]>([]);
  const [selSavedPlan,  setSelSavedPlan]= useState<SavedPlan|null>(null);
  const [earnedCoupons, setEarnedCoupons] = useState<EarnedCoupon[]>([]);
  const [userPoints,    setUserPoints]  = useState(1240);
  const [selMachineIdx,   setSelMachineIdx]   = useState(0);
  const [workoutExercises, setWorkoutExercises] = useState<PlanExercise[]>([]);
  const [singleExercise,   setSingleExercise]   = useState<PlanExercise>(MACHINES[0].defaultExercise);
  const [streakDays,       setStreakDays]        = useState(2);
  const [chatMsgs, setChatMsgs] = useState<Msg[]>([WELCOME]);
  const [inGym,            setInGym]            = useState(true);
  const [showLocPopup,     setShowLocPopup]      = useState(false);
  const [showWorkoutChat,  setShowWorkoutChat]   = useState(false);
  function toggleGym(val: boolean) {
    setInGym(val);
    if (val) { setShowLocPopup(true); setTimeout(() => setShowLocPopup(false), 2600); }
  }
  function startWorkout(exs: PlanExercise[]) { setWorkoutExercises(exs); nav("workout-session"); }
  function completeWorkout() { setStreakDays(d => Math.min(d + 1, 5)); setShowWorkoutChat(false); nav("workout-summary"); }
  function startSingle(ex: PlanExercise) { setSingleExercise(ex); nav("single-exercise"); }

  const current = history[history.length - 1];
  function nav(r: Route) { setHistory(p => [...p, r]); }
  function navTab(t: NavTab) { setHistory([NAV_ROUTE_MAP[t] ?? (t as Route)]); }
  function addPlan(plan: SavedPlan) { setSavedPlans(p => [...p, plan]); }

  const showNav = SHOW_NAV_ROUTES.includes(current);
  const curTab  = activeTab(current);

  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"100vh", width:"100%", background:"#060609", fontFamily:"'Barlow',sans-serif" }}>
      <div style={{ position:"relative", display:"flex", flexDirection:"column", overflow:"hidden", width:"390px", height:"720px", background:"#0B0B12", borderRadius:"36px", boxShadow:"0 0 0 1px rgba(255,255,255,0.06),0 40px 120px rgba(0,0,0,0.9),0 0 60px rgba(255,77,0,0.08)" }}>
        <StatusBar/>

        {current === "login"            && <LoginScreen nav={nav}/>}
        {current === "onboarding"       && <OnboardingScreen nav={nav}/>}
        {current === "inicio"           && <HomeScreen nav={nav} onStartWorkout={startWorkout} inGym={inGym} onToggleGym={toggleGym}/>}
        {current === "qr"               && <QRScanScreen nav={nav} onScan={i=>setSelMachineIdx(i)}/>}
        {current === "chatbot"          && <ChatbotScreen inGym={inGym} msgs={chatMsgs} setMsgs={setChatMsgs}/>}
        {current === "historial"        && <HistorialScreen nav={nav}/>}
        {current === "historial-stats"  && <HistorialStatsScreen nav={nav}/>}
        {current === "planes"           && <PlanesScreen nav={nav} onSelectCategory={setSelCategory} savedPlans={savedPlans}/>}
        {current === "rutina-categoria" && <RutinaCategoriaScreen nav={nav} category={selCategory} onSelectProgram={setSelProgram} savedPlans={savedPlans} onSelectSavedPlan={setSelSavedPlan}/>}
        {current === "mis-plan-detalle" && selSavedPlan && <MiPlanDetalleScreen nav={nav} plan={selSavedPlan} onStartWorkout={startWorkout}/>}
        {current === "rutina-detalle"   && <RutinaDetalleScreen nav={nav} program={selProgram} onStartWorkout={startWorkout}/>}
        {current === "plan-manual"      && <PlanManualScreen nav={nav} onSave={p=>{ addPlan(p); }}/>}
        {current === "plan-ia"          && <PlanIAScreen nav={nav} onSave={p=>{ addPlan(p); }}/>}
        {current === "workout-session"  && (
          <div style={{ flex:1, display:"flex", flexDirection:"column", position:"relative" }}>
            <WorkoutSessionScreen nav={nav} exercises={workoutExercises} onComplete={completeWorkout}/>
            {!showWorkoutChat && (
              <button onClick={()=>setShowWorkoutChat(true)} style={{ position:"absolute", bottom:24, right:20, width:52, height:52, borderRadius:"50%", background:"linear-gradient(135deg,#7B61FF,#FF4D00)", border:"none", cursor:"pointer", boxShadow:"0 4px 24px rgba(123,97,255,0.5)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:20 }}>
                <Bot size={22} color="#fff"/>
              </button>
            )}
            {showWorkoutChat && (
              <div style={{ position:"absolute", inset:0, zIndex:50, display:"flex", flexDirection:"column", background:"#0B0B12" }}>
                <button onClick={()=>setShowWorkoutChat(false)} style={{ flexShrink:0, display:"flex", alignItems:"center", gap:"8px", padding:"14px 20px", background:"#0B0B12", border:"none", borderBottom:"1px solid rgba(255,255,255,0.07)", cursor:"pointer" }}>
                  <ChevronLeft size={20} color="#FF4D00"/>
                  <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"15px", fontWeight:800, color:"#FF4D00" }}>Volver al ejercicio</span>
                </button>
                <ChatbotScreen inGym={inGym} msgs={chatMsgs} setMsgs={setChatMsgs}/>
              </div>
            )}
          </div>
        )}
        {current === "workout-summary"  && <WorkoutSummaryScreen nav={nav} streakDays={streakDays} inGym={inGym}/>}
        {current === "gamification"     && <GamificationScreen nav={nav} earnedCoupons={earnedCoupons} points={userPoints} streakDays={streakDays} inGym={inGym}/>}
        {current === "coupon-wallet"    && <CouponWalletScreen nav={nav} earnedCoupons={earnedCoupons} points={userPoints}/>}
        {current === "tienda-premios"   && <TiendaPremiosScreen nav={nav} points={userPoints} onRedeem={(c,cost)=>{ setEarnedCoupons(p=>[...p,c]); setUserPoints(p=>p-cost); nav("gamification"); }}/>}
        {current === "profile"          && <ProfileScreen nav={nav}/>}
        {current === "settings"         && <SettingsScreen nav={nav}/>}
        {current === "guia-maquinas"    && <GuiaMaquinasScreen nav={nav} onSelectMachine={i=>{ setSelMachineIdx(i); }}/>}
        {current === "maquina-detalle"  && <MaquinaDetalleScreen nav={nav} machine={MACHINES[selMachineIdx]} fromGuide={history[history.length-2]==="guia-maquinas"} onStartSingle={ex=>startSingle(ex)}/>}
        {current === "single-exercise"  && (
          <div style={{ flex:1, display:"flex", flexDirection:"column", position:"relative" }}>
            <SingleExerciseScreen nav={nav} exercise={singleExercise} machine={MACHINES[selMachineIdx]}/>
            {!showWorkoutChat && (
              <button onClick={()=>setShowWorkoutChat(true)} style={{ position:"absolute", bottom:24, right:20, width:52, height:52, borderRadius:"50%", background:"linear-gradient(135deg,#7B61FF,#FF4D00)", border:"none", cursor:"pointer", boxShadow:"0 4px 24px rgba(123,97,255,0.5)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:20 }}>
                <Bot size={22} color="#fff"/>
              </button>
            )}
            {showWorkoutChat && (
              <div style={{ position:"absolute", inset:0, zIndex:50, display:"flex", flexDirection:"column", background:"#0B0B12" }}>
                <button onClick={()=>setShowWorkoutChat(false)} style={{ flexShrink:0, display:"flex", alignItems:"center", gap:"8px", padding:"14px 20px", background:"#0B0B12", border:"none", borderBottom:"1px solid rgba(255,255,255,0.07)", cursor:"pointer" }}>
                  <ChevronLeft size={20} color="#FF4D00"/>
                  <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"15px", fontWeight:800, color:"#FF4D00" }}>Volver al ejercicio</span>
                </button>
                <ChatbotScreen inGym={inGym} msgs={chatMsgs} setMsgs={setChatMsgs}/>
              </div>
            )}
          </div>
        )}

        {showNav && <BottomNav active={curTab} onNav={navTab}/>}

        {/* Location verified popup — top banner, same style as workout challenge popup */}
        <div style={{ position:"absolute", top:"48px", left:0, right:0, padding:"12px 20px 0", pointerEvents:"none", zIndex:999, transition:"opacity 0.45s ease, transform 0.45s ease", opacity:showLocPopup?1:0, transform:showLocPopup?"translateY(0)":"translateY(-14px)" }}>
          <div style={{ borderRadius:"16px", background:"#0F1F15", border:"1.5px solid rgba(48,209,88,0.5)", padding:"12px 16px", display:"flex", alignItems:"center", gap:"12px", boxShadow:"0 8px 32px rgba(0,0,0,0.6), 0 0 20px rgba(48,209,88,0.15)" }}>
            <div style={{ width:"40px", height:"40px", borderRadius:"12px", background:"rgba(48,209,88,0.18)", border:"1px solid rgba(48,209,88,0.4)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <MapPin size={20} color="#30D158"/>
            </div>
            <div style={{ flex:1 }}>
              <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"15px", fontWeight:900, color:"#30D158", textTransform:"uppercase", letterSpacing:"0.04em", lineHeight:1.1 }}>Ubicación Verificada</p>
              <p style={{ fontSize:"12px", color:"#F2F2F7", fontWeight:600, marginTop:"2px", lineHeight:1.3 }}>Estás en Imperium Cross · Acceso completo activado</p>
              <p style={{ fontSize:"10px", color:"#8E8EA0", marginTop:"3px" }}>Retos, premios y Coach IA desbloqueados</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
