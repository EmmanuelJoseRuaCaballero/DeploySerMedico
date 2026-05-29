# e-Portafolio SerMédico

Aplicación web **full-stack** diseñada para la gestión integral de portafolios clínicos universitarios, permitiendo el seguimiento de prácticas, casos clínicos y competencias académicas.

---

## Stack Tecnológico

* **Frontend:** React + Vite + TypeScript
* **Backend:** Django + Django REST Framework (DRF)
* **Base de Datos:** PostgreSQL
* **Estilos:** Tailwind CSS + Lucide React (iconografía)

---

## Requisitos Previos

Antes de comenzar, verifica que tienes instalado:
* **Python:** 3.14 o superior
* **Node.js:** 24 o superior
* **npm:** Incluido con Node.js

```bash
# Verificar versiones
python --version
node --version
npm --version

# Crear entorno virtual
python -m venv venv

# Activar entorno
# Windows:
venv\Scripts\activate

# Instalaciones en python:
# Instalar dependencias
pip install django djangorestframework django-cors-headers psycopg2-binary
pip install djangorestframework-simplejwt
pip install Pillow
pip install pandas openpyxl

# Configurar Base de Datos
python manage.py makemigrations
python manage.py migrate

# Iniciar servidor
python manage.py runserver

# Instalaciones react:
# Instalar dependencias base
npm install

# Instalar librerías adicionales
npm install react-router-dom axios lucide-react
npm install -D tailwindcss@3 postcss autoprefixer
npm install tailwindcss-animate
npm install @tanstack/react-query
npm install @radix-ui/react-tooltip
npm install next-themes sonner
npm install @radix-ui/react-toast
npm install clsx tailwind-merge
npm install class-variance-authority
npm install react-day-picker
npm install @radix-ui/react-select
npm install @radix-ui/react-dialog
npm install @radix-ui/react-label
npm install @radix-ui/react-popover
npm install @radix-ui/react-checkbox
npm install @radix-ui/react-dropdown-menu
npm install @radix-ui/react-accordion
npm install sileo

# Graficas
npm install recharts

# Iniciar entorno de desarrollo
npm run dev
```

## Estructura proyecto:

Estructura del proyecto dividida en 2 partes, backend y frontend:

---

```
backend/
├── app/
│   ├── api/
│   ├── models.py
│   └── urls.py 
│
├── config/
│   ├── settings.py
│   └── urls.py
│
└── media/
    └── fotos_perfil/

frontend/
├── public/
│   └── assets/
│       └── files/
│   
├── src/
│   ├── components/
│   │   ├── ui/
|   |   ├── DashboardLayout.tsx
|   |   ├── Navbar.tsx
|   |   └── Sidebar.tsx
|   |
|   ├── hooks/
|   |
|   ├── lib/
|   |   └── utils/
|   |
|   ├── pages/   
│   │   ├── dashboard/
│   │   └── roles/
|   │       ├── coordinador_curso/
|   │       ├── estudiante/
|   │       └── profesor/
|   |
|   ├── styles/
|   |   └── index.css
|   |
│   ├── App.tsx
│   └── main.tsx
|
├── index.html
└── tailwind.config.ts

README.md
```

## Datos SQL:

Consultas SQL, aqui estaran las consultas para las tablas donde los datos son estaticos.

---
## Procedimientos clinicos
```sql
-- PROCEDIMIENTOS
INSERT INTO app_procedimientos (id_procedimientos, nombre_p) VALUES
(1000,'PROCEDIMIENTOS TRANSVERSALES'),
(2000,'SEMIOLOGÍA'),
(3000,'ANESTESIOLOGÍA'),
(4000,'ATENCIÓN PRIMARIA'),
(5000,'CIRUGÍA'),
(6000,'DERMATOLOGÍA'),
(7000,'GINECOLOGÍA - OBSTETRICIA'),
(8000,'MEDICINA INTERNA-URGENCIAS'),
(9000,'PEDIATRÍA'),
(10000,'ORTOPEDIA'),
(11000,'PSIQUIATRÍA'),
(12000,'OTORRINOLARINGOLOGÍA'),
(13000,'OFTALMOLOGÍA'),
(14000,'UROLOGÍA'),
(15000,'MEDICINA LEGAL');

-- OPCION_PRODECIMIENTOS
INSERT INTO app_opcionprocedimientos (id_opcion_procedimientos,nombre_op,id_procedimientos_id) VALUES
-- PROCEDIMIENTOS TRANSVERSALES
(1001,'Toma e interpretación de medidas antropométricas',1000),
(1002,'Administración de medicamentos',1000),
(1003,'Diligenciamiento de fichas de notificación obligatoria de eventos de interés en salud pública',1000),
(1004,'Comunicación de malas noticias',1000),
(1005,'Elaboración e interpretación de instrumentos familiares, Familograma',1000),
(1006,'Elaboración e interpretación de instrumentos familiares, Ecomapa',1000),
(1007,'Elaboración e interpretación de instrumentos familiares, APGAR familiar',1000),
(1008,'Elaboración e interpretación de ficha familiar',1000),
(1009,'Interpretación de medidas epidemiológicas',1000),
(1010,'Registro de eventos vitales',1000),

-- SEMIOLOGIA
(2001,'Entrevista clínica estructurada (anamnesis)',2000),
(2002,'Examen físico',2000),
(2003,'Elaboración de historia clínica completa',2000),
(2004,'Toma e interpretación de signos vitales',2000),
(2005,'Obtención del consentimiento informado',2000),

-- ANESTESIOLOGIA
(3001,'Administración y evaluación de sedación básica',3000),
(3002,'Infiltración de anestesia local',3000),

-- ATENCION PRIMARIA
(4001,'Evaluación por sistemas',4000),
(4002,'Análisis e interpretación de laboratorios adultos',4000),
(4003,'Análisis e interpretación de laboratorios niños',4000),
(4004,'Realización de procedimientos para desimpactación fecal',4000),
(4005,'Administración de enemas rectales',4000),

-- CIRUGIA
(5001,'Técnica de lavado de manos',5000),
(5002,'Colocación de guantes estériles',5000),
(5003,'Colocación de vestimenta quirúrgica',5000),
(5004,'Colocación adecuada de vendajes y apósitos',5000),
(5005,'Debridamiento y limpieza de heridas superficiales',5000),
(5006,'Cierre de heridas por sutura o grapas',5000),
(5007,'Retiro de suturas o grapas',5000),
(5008,'Infiltración de anestesia local para cierre de heridas menores',5000),
(5009,'Realización de maniobras hemostáticas',5000),

-- DERMATOLOGIA
(6001,'Realización de escisión de onicocriptosis',6000),
(6002,'Realización de drenaje de paroniquia aguda',6000),
(6003,'Remoción de cuerpo extraño incrustado en piel',6000),
(6004,'Valoración y curación simple de heridas',6000),

-- GINECOLOGIA OBSTETRICIA
(7001,'Ejecución de maniobras de Leopold',7000),
(7002,'Atención del parto vaginal normal',7000),
(7003,'Colocación del dispositivo intrauterino DIU',7000),
(7004,'Inserción de implantes subcutáneos para planificación familiar',7000),
(7005,'Realización de tacto vaginal',7000),
(7006,'Realización de especuloscopia',7000),
(7007,'Diligenciamiento e interpretación del partograma',7000),
(7008,'Realización e interpretación del monitoreo fetal',7000),
(7009,'Realización de aspiración manual endouterina AMEU',7000),
(7010,'Reparación de desgarros perineales',7000),
(7011,'Realización de amniotomía durante el parto',7000),
(7012,'Realización de episiotomía o episiorrafia',7000),
(7013,'Toma de muestras para citología cervicovaginal',7000),
(7014,'Obtención de muestras para frotis de flujo vaginal',7000),
(7015,'Remoción manual de placenta retenida',7000),
(7016,'Reconocimiento y respuesta ante código rojo en obstetricia',7000),
(7017,'Reconocimiento y respuesta ante parto distócico',7000),
(7018,'Reconocimiento y respuesta ante parto en podálico',7000),

-- MEDICINA INTERNA URGENCIAS
(8001,'Reconocimiento y respuesta ante signos de paro cardiorespiratorio',8000),
(8002,'RCP básico',8000),
(8003,'RCP avanzado',8000),
(8004,'Administración de oxigenoterapia',8000),
(8005,'Administración de ventilación bolsa mascarilla',8000),
(8006,'Colocación de dispositivos alternativos de vía aérea',8000),
(8007,'Inserción de tubo a tórax en urgencias',8000),
(8008,'Inserción de vías intravenosas periféricas',8000),
(8009,'Identificación y abordaje inicial de paciente intoxicado',8000),
(8010,'Colocación de sondas nasogástricas',8000),
(8011,'Realización de punciones arteriales',8000),
(8012,'Ejecución de desfibrilación cardiaca',8000),
(8013,'Realización e interpretación de electrocardiograma',8000),
(8014,'Intubación orotraqueal',8000),
(8015,'Realización de compresiones cardiacas',8000),
(8016,'Manejo integral del paciente con estatus epiléptico',8000),
(8017,'Toma de muestras orofaríngeas o nasofaríngeas',8000),
(8018,'Realización de lavado gástrico',8000),
(8019,'Colocación de carbón activado',8000),
(8020,'Realización de toracentesis',8000),
(8021,'Realización de paracentesis',8000),
(8022,'Realización de punción lumbar',8000),
(8023,'Realización de eco fast',8000),
(8024,'Interpretación de escala NEWS',8000),
(8025,'Interpretación de escala CURB 65',8000),
(8026,'Interpretación de escala qSOFA',8000),

-- PEDIATRIA
(9001,'Administración de medicamentos en pacientes pediátricos',9000),
(9002,'Administración de oxigenoterapia en pacientes pediátricos',9000),
(9003,'Administración de ventilación bolsa mascarilla en pacientes pediátricos',9000),
(9004,'Canalización de vena umbilical',9000),
(9005,'Colocación de dispositivos de vía aérea en pediatría',9000),
(9006,'RCP básico pediátrico',9000),
(9007,'RCP avanzado pediátrico',9000),
(9008,'Realización del minuto de oro',9000),
(9009,'Compresiones cardiacas pediátricas',9000),
(9010,'Desfibrilación cardiaca pediátrica',9000),
(9011,'Intubación orotraqueal pediátrica',9000),
(9012,'Identificación y abordaje inicial de paciente intoxicado pediátrico',9000),
(9013,'Lavado gástrico pediátrico',9000),
(9014,'Carbón activado pediátrico',9000),
(9015,'Obtención de hemocultivos en pediatría',9000),

-- ORTOPEDIA
(10001,'Manipulación e inmovilización de fracturas en extremidades superiores',10000),
(10002,'Manipulación e inmovilización de fracturas en extremidades inferiores',10000),
(10003,'Manipulación de luxaciones en extremidades inferiores',10000),
(10004,'Manipulación de luxaciones en extremidades superiores',10000),
(10005,'Manejo funcional de esguince',10000),

-- PSIQUIATRIA
(11001,'Aplicación de escalas básicas de evaluación de salud mental',11000),
(11002,'Manejo de pacientes con agitación psicomotora',11000),

-- OTORRINOLARINGOLOGIA
(12001,'Taponamiento nasal para epistaxis anterior',12000),
(12002,'Extracción de cuerpo extraño en cavidad nasal',12000),
(12003,'Extracción de cuerpo extraño en conducto auditivo',12000),

-- OFTALMOLOGIA
(13001,'Extracción de cuerpo extraño de la córnea o conjuntiva',13000),
(13002,'Lavado ocular',13000),
(13003,'Abordaje inicial de trauma ocular',13000),

-- UROLOGIA
(14001,'Toma de muestras de secreción uretral',14000),
(14002,'Colocación de sonda vesical',14000),
(14003,'Punción suprapúbica',14000),
(14004,'Tacto rectal para valoración de próstata',14000),

-- MEDICINA LEGAL
(15001,'Toma de muestras en caso de agresión sexual',15000),
(15002,'Realización de necropsias',15000),
(15003,'Certificado médico legal de lesiones personales',15000);

-- SUB_OPCION_PROCEDIMIENTOS
INSERT INTO app_subopcionprocedimientos 
(id_sub_opcion_procedimientos,nombre_sop,id_opcion_procedimientos_id) VALUES
-- PROCEDIMIENTOS TRANSVERSALES
(100201,'Intramuscular',1002),
(100202,'Intravenoso',1002),
(100203,'Subcutáneo',1002),
(100204,'Intradérmica',1002),

-- SEMIOLOGIA
(200101,'Adulto',2001),
(200102,'Niños',2001),
(200103,'Mujer',2001),
(200104,'Psiquiátrica',2001),

(200201,'Órgano de los sentidos',2002),
(200202,'Cardiovascular',2002),
(200203,'Respiratorio',2002),
(200204,'Abdominal',2002),
(200205,'Neurológico',2002),

-- ANESTESIOLOGIA
(300201,'Bloqueo nervioso en dedos de manos y pies',3002),
(300202,'Bloqueo nervioso de plexo braquial',3002),
(300203,'Bloqueo nervioso de plexo ciático',3002),
(300204,'Anestesia epidural',3002),

-- ATENCION PRIMARIA
(400101,'Cerebro',4001),
(400102,'Cuello',4001),
(400103,'Tórax',4001),
(400104,'Abdomen',4001),
(400105,'Osteomusculares',4001),

(400201,'Hemograma',4002),
(400202,'Uroanálisis',4002),
(400203,'Coprológico',4002),
(400204,'Química sanguínea',4002),

(400301,'Hemograma',4003),
(400302,'Uroanálisis',4003),
(400303,'Coprológico',4003),
(400304,'Química sanguínea',4003),

-- CIRUGIA
(500101,'Simple',5001),
(500102,'Quirúrgico',5001),

(500901,'Torniquete',5009),
(500902,'Compresión',5009),
(500903,'Ligadura',5009),

-- GINECOLOGIA OBSTETRICIA
(701001,'Grado I',7010),
(701002,'Grado II',7010),

-- MEDICINA INTERNA URGENCIAS
(800901,'Estabilización',8009),
(800902,'Descontaminación',8009),
(800903,'Antídoto',8009),
(800904,'Seguimiento',8009),

-- PEDIATRIA
(900101,'Intramuscular',9001),
(900102,'Intravenoso',9001),
(900103,'Subcutáneo',9001),
(900104,'Intradérmica',9001),

(901201,'Estabilización',9012),
(901202,'Descontaminación',9012),
(901203,'Antídoto',9012),
(901204,'Seguimiento',9012),

-- PSIQUIATRIA
(1100101,'Escala para Ansiedad',11001),
(1100102,'Escala para Depresión',11001),
(1100103,'Escala de Bienestar General',11001),
(1100104,'Escala para Ideación Suicida',11001),
(1100105,'Escala para Esquizofrenia',11001),

-- UROLOGIA
(1400201,'Hombres',14002),
(1400202,'Mujeres',14002);
```

## Lugares de practica
```sql
INSERT INTO app_lugar (nombre_lugar) VALUES
('CLINICA REINA CATALINA'),
('HOSPITAL JUAN DOMINGUEZ ROMERO'),
('CAMINO BOSQUE DE MARÍA'),
('CLINICA DE LA COSTA'),
('HOSPITAL MATERNO INFANTIL 13 CIUDADELA METROPOLITANA DE SOLEDAD'),
('CAMINO LA MANGA'),
('CAMINO DISTRITAL ADELITA DE CHAR'),
('MI RED'),
('LABORATORIO DE SIMULACION'),
('CAMINO NUEVO HOSPITAL GENERAL DE BARRANQUILLA'),
('CLINICA LA ASUNCION'),
('CLINICA IBEROAMERICA'),
('CLINICA LA POLICIA'),
('CLINICA CENTRO'),
('CLINICA CAMPBELL'),
('CAMINO SANTA MARIA'),
('CAMINO MURILLO'),
('CLINICA MISERICORDIA'),
('CAMINO SUROCCIDENTE'),
('NEUROHEATH'),
('C.M.C'),
('IINSTUTUTO TERAPEUTICO VILLA 76'),
('MOVERSE IPS'),
('INSTITUTO QUIRURGICO DEL NORTE'),
('CLINICA OFTALMOLOGICA'),
('MEDICLINICA'),
('ALMENDROS'),
('CLINICA SAN DIEGO'),
('ESE UNA'),
('ADELA DE CHAR SOLEDAD'),
('CAMINO METROPOLITANO'),
('ADELA DE CHAR 21'),
('CIUDADELA 20 DE JULIO'),
('CACE NIÑO JESUS'),
('CACE PEDIATRICO'),
('CLINICA SAN MARTIN'),
('HOSPITAL MATERNO INFANTIL DE SOLEDAD: 13 DE JUNIO'),
('HOSPITAL MATERNO INFANTIL DE SOLEDAD: SALAMANCA'),
('HOSPITAL MATERNO INFANTIL DE SOLEDAD: COSTA HERMOSA'),
('IPS SALUD SOCIAL'),
('TRABAJO DE CAMPO EN LA COMUNIDAD'),
('SALÓN DE LA UNIVERSIDAD SIMÓN BOLÍVAR'),
('ROTACIÓN INTERNADO'),
('LABORATORIO DE SIMULACIÓN CLÍNICA DE LA UNIVERSIDAD SIMÓN BOLÍVAR'),
('INSTITUTO NACIONAL DE MEDICINA LEGAL Y CIENCIAS FORENCES, REGIONAL NORTE');
```

## Cursos
```sql
INSERT INTO app_cursos (nombre) VALUES
('Semilogia'),
('MedicinaInterna'),
('Cirugia'),
('Psiquiatria'),
('Ginecologia'),
('Pediatria');
```

## Roles

Roles que seran utilizados a lo largo del proyecto

```sql
INSERT INTO auth_group (name) VALUES
('Estudiante'),
('Profesor'),
('CoordinadorCurso'),
('CoordinadorPracticaInternado'),
('DirectorPrograma');
```

## Crear usuarios por consola:

1. Acceder a la carpeta **BACKEND**
2. Activar el etorno virtual
3. Ejucta la shell interactiva de django ⟶ *python manage.py shell*
4. Sigue las intrucciones del siguiente codigo:

```python
from django.contrib.auth.models import User, Group

# Opcional:
# Crear rol en tal caso aun no exista
Group.objects.get_or_create(name="Estudiante")

# Crear usuario
user = User.objects.create_user(username="nombreusuario", password="contraseña")

# Obtener rol
grupo = Group.objects.get(name="Estudiante")

# Asignar rol
user.groups.add(grupo)

# Salir del shell
exit()
```