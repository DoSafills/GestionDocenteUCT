#!/usr/bin/env python3
"""
Script para crear el esquema completo de la base de datos de test local.
"""
import os
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from dotenv import load_dotenv

load_dotenv()

# SQL para crear el esquema completo
SCHEMA_SQL = """
-- Crear extensión para UUID si no existe
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Crear secuencias
CREATE SEQUENCE IF NOT EXISTS bloque_bloque_id_seq;
CREATE SEQUENCE IF NOT EXISTS clase_clase_id_seq;

-- Tabla Campus
CREATE TABLE IF NOT EXISTS public.campus (
  codigo character varying NOT NULL,
  nombre character varying NOT NULL,
  CONSTRAINT campus_pkey PRIMARY KEY (codigo)
);

-- Tabla Edificio
CREATE TABLE IF NOT EXISTS public.edificio (
  codigo character varying NOT NULL,
  numero character varying NOT NULL,
  nombre character varying NOT NULL,
  campus_codigo character varying NOT NULL,
  CONSTRAINT edificio_pkey PRIMARY KEY (codigo),
  CONSTRAINT edificio_campus_codigo_fkey FOREIGN KEY (campus_codigo) REFERENCES public.campus(codigo)
);

-- Tabla Sala
CREATE TABLE IF NOT EXISTS public.sala (
  codigo character varying NOT NULL,
  numero character varying NOT NULL,
  capacidad integer,
  tipo character varying,
  piso character varying,
  estado character varying DEFAULT 'DISPONIBLE'::character varying,
  edificio_codigo character varying NOT NULL,
  CONSTRAINT sala_pkey PRIMARY KEY (codigo),
  CONSTRAINT sala_edificio_codigo_fkey FOREIGN KEY (edificio_codigo) REFERENCES public.edificio(codigo)
);

-- Tabla Asignatura
CREATE TABLE IF NOT EXISTS public.asignatura (
  codigo character varying NOT NULL,
  nombre character varying NOT NULL,
  creditos integer NOT NULL,
  tipo character varying,
  CONSTRAINT asignatura_pkey PRIMARY KEY (codigo)
);

-- Tabla Seccion
CREATE TABLE IF NOT EXISTS public.seccion (
  seccion_id uuid NOT NULL DEFAULT uuid_generate_v4(),
  numero integer NOT NULL,
  codigo character varying NOT NULL UNIQUE,
  anio integer NOT NULL,
  semestre integer NOT NULL,
  asignatura_codigo character varying NOT NULL,
  cupos integer,
  CONSTRAINT seccion_pkey PRIMARY KEY (seccion_id),
  CONSTRAINT seccion_asignatura_codigo_fkey FOREIGN KEY (asignatura_codigo) REFERENCES public.asignatura(codigo)
);

-- Tabla Bloque
CREATE TABLE IF NOT EXISTS public.bloque (
  bloque_id integer NOT NULL DEFAULT nextval('bloque_bloque_id_seq'::regclass),
  dia_semana integer NOT NULL CHECK (dia_semana >= 1 AND dia_semana <= 7),
  hora_inicio time without time zone NOT NULL,
  hora_fin time without time zone NOT NULL,
  CONSTRAINT bloque_pkey PRIMARY KEY (bloque_id)
);

-- Tabla Docente
CREATE TABLE IF NOT EXISTS public.docente (
  docente_rut character varying NOT NULL,
  nombre character varying NOT NULL,
  email character varying NOT NULL UNIQUE,
  pass_hash text NOT NULL,
  max_horas_docencia integer DEFAULT 20,
  CONSTRAINT docente_pkey PRIMARY KEY (docente_rut)
);

-- Tabla Clase
CREATE TABLE IF NOT EXISTS public.clase (
  clase_id integer NOT NULL DEFAULT nextval('clase_clase_id_seq'::regclass),
  seccion_id uuid NOT NULL,
  docente_rut character varying NOT NULL,
  sala_codigo character varying NOT NULL,
  bloque_id integer NOT NULL,
  estado character varying DEFAULT 'Propuesto'::character varying,
  CONSTRAINT clase_pkey PRIMARY KEY (clase_id),
  CONSTRAINT clase_sala_codigo_fkey FOREIGN KEY (sala_codigo) REFERENCES public.sala(codigo),
  CONSTRAINT clase_seccion_id_fkey FOREIGN KEY (seccion_id) REFERENCES public.seccion(seccion_id),
  CONSTRAINT clase_docente_rut_fkey FOREIGN KEY (docente_rut) REFERENCES public.docente(docente_rut),
  CONSTRAINT clase_bloque_id_fkey FOREIGN KEY (bloque_id) REFERENCES public.bloque(bloque_id)
);

-- Tabla Reporte
CREATE TABLE IF NOT EXISTS public.reporte (
  reporte_id uuid NOT NULL DEFAULT uuid_generate_v4(),
  tipo character varying NOT NULL,
  generado_en timestamp without time zone DEFAULT now(),
  generado_por character varying,
  comentario text,
  CONSTRAINT reporte_pkey PRIMARY KEY (reporte_id)
);

-- Tabla ReporteDetalleHoras
CREATE TABLE IF NOT EXISTS public.reportedetallehoras (
  reporte_id uuid NOT NULL,
  docente_rut character varying NOT NULL,
  horas_asignadas double precision DEFAULT 0,
  max_horas double precision DEFAULT 0,
  exceso double precision DEFAULT 0,
  estado character varying DEFAULT 'OK'::character varying,
  CONSTRAINT reportedetallehoras_pkey PRIMARY KEY (reporte_id, docente_rut),
  CONSTRAINT reportedetallehoras_reporte_id_fkey FOREIGN KEY (reporte_id) REFERENCES public.reporte(reporte_id),
  CONSTRAINT reportedetallehoras_docente_rut_fkey FOREIGN KEY (docente_rut) REFERENCES public.docente(docente_rut)
);

-- Tabla Restriccion
CREATE TABLE IF NOT EXISTS public.restriccion (
  restriccion_id uuid NOT NULL DEFAULT uuid_generate_v4(),
  docente_rut character varying NOT NULL,
  tipo character varying NOT NULL,
  operador character varying,
  valor character varying,
  prioridad double precision DEFAULT 1.0,
  comentario text,
  CONSTRAINT restriccion_pkey PRIMARY KEY (restriccion_id),
  CONSTRAINT restriccion_docente_rut_fkey FOREIGN KEY (docente_rut) REFERENCES public.docente(docente_rut)
);

-- Tabla temporal para JSON
CREATE TABLE IF NOT EXISTS public.tmp_salas_json (
  data jsonb
);
"""

# Datos de ejemplo para testing
SAMPLE_DATA_SQL = """
-- Insertar datos de ejemplo para testing

-- Campus
INSERT INTO public.campus (codigo, nombre) VALUES 
('CAMPUS_1', 'Campus Principal'),
('CAMPUS_2', 'Campus Norte')
ON CONFLICT (codigo) DO NOTHING;

-- Edificios
INSERT INTO public.edificio (codigo, numero, nombre, campus_codigo) VALUES
('EDI_001', '1', 'Edificio Central', 'CAMPUS_1'),
('EDI_002', '2', 'Edificio Informática', 'CAMPUS_1')
ON CONFLICT (codigo) DO NOTHING;

-- Salas
INSERT INTO public.sala (codigo, numero, capacidad, tipo, piso, estado, edificio_codigo) VALUES
('SALA_101', '101', 30, 'Aula', '1', 'DISPONIBLE', 'EDI_001'),
('SALA_102', '102', 25, 'Laboratorio', '1', 'DISPONIBLE', 'EDI_002')
ON CONFLICT (codigo) DO NOTHING;

-- Asignaturas
INSERT INTO public.asignatura (codigo, nombre, creditos, tipo) VALUES
('ING001', 'Programación I', 6, 'Obligatorio'),
('ING002', 'Base de Datos', 5, 'Obligatorio')
ON CONFLICT (codigo) DO NOTHING;

-- Bloques de horario
INSERT INTO public.bloque (bloque_id, dia_semana, hora_inicio, hora_fin) VALUES
(1, 1, '08:00:00', '09:30:00'),
(2, 1, '09:45:00', '11:15:00'),
(3, 2, '08:00:00', '09:30:00')
ON CONFLICT (bloque_id) DO NOTHING;

-- Secciones
INSERT INTO public.seccion (seccion_id, numero, codigo, anio, semestre, asignatura_codigo, cupos) VALUES
('550e8400-e29b-41d4-a716-446655440001', 1, 'ING001-1', 2024, 1, 'ING001', 30),
('550e8400-e29b-41d4-a716-446655440002', 1, 'ING002-1', 2024, 1, 'ING002', 25)
ON CONFLICT (seccion_id) DO NOTHING;

-- Docentes de ejemplo
INSERT INTO public.docente (docente_rut, nombre, email, pass_hash, max_horas_docencia) VALUES
('11111111-1', 'Dr. Juan Pérez', 'juan.perez@uct.cl', 'hash_juan123', 20),
('22222222-2', 'Dra. María López', 'maria.lopez@uct.cl', 'hash_maria456', 18),
('33333333-3', 'Prof. Carlos Silva', 'carlos.silva@uct.cl', 'hash_carlos789', 22)
ON CONFLICT (docente_rut) DO NOTHING;
"""

def setup_complete_test_database():
    """Configura la base de datos de test con el esquema completo."""
    print("🔧 Configurando base de datos de test con esquema completo...")
    
    # Configuración de conexión
    config = {
        'host': os.getenv('TEST_DATABASE_HOST', 'localhost'),
        'port': int(os.getenv('TEST_DATABASE_PORT', 5432)),
        'user': os.getenv('TEST_DATABASE_USER', 'postgres'),
        'password': os.getenv('TEST_DATABASE_PASSWORD', 'admin'),
    }
    
    test_db_name = os.getenv('TEST_DATABASE_NAME', 'gestion_docente_test')
    
    try:
        # 1. Crear la base de datos si no existe
        print(f"📡 Conectando a PostgreSQL en {config['host']}...")
        admin_conn = psycopg2.connect(database='postgres', **config)
        admin_conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        admin_cursor = admin_conn.cursor()
        
        # Verificar si la BD existe
        admin_cursor.execute(
            "SELECT 1 FROM pg_database WHERE datname = %s",
            (test_db_name,)
        )
        
        if admin_cursor.fetchone():
            print(f"✅ Base de datos '{test_db_name}' ya existe")
        else:
            # Crear la BD
            admin_cursor.execute(f'CREATE DATABASE "{test_db_name}"')
            print(f"✅ Base de datos '{test_db_name}' creada exitosamente")
        
        admin_cursor.close()
        admin_conn.close()
        
        # 2. Conectar a la BD de test y crear esquema
        print("🔧 Creando esquema de tablas...")
        test_conn = psycopg2.connect(database=test_db_name, **config)
        test_cursor = test_conn.cursor()
        
        # Ejecutar script de esquema
        test_cursor.execute(SCHEMA_SQL)
        test_conn.commit()
        print("✅ Esquema creado exitosamente")
        
        # 3. Insertar datos de ejemplo
        print("📝 Insertando datos de ejemplo...")
        test_cursor.execute(SAMPLE_DATA_SQL)
        test_conn.commit()
        print("✅ Datos de ejemplo insertados")
        
        # 4. Verificar las tablas creadas
        test_cursor.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name
        """)
        tables = [row[0] for row in test_cursor.fetchall()]
        print(f"📊 Tablas creadas: {', '.join(tables)}")
        
        test_cursor.close()
        test_conn.close()
        
        print("\n🎉 ¡Base de datos de test configurada exitosamente!")
        print(f"🔗 Conexión: postgresql://{config['user']}:***@{config['host']}:{config['port']}/{test_db_name}")
        
        return True
        
    except psycopg2.OperationalError as e:
        print(f"❌ Error de conexión: {e}")
        print("💡 Verifica que PostgreSQL esté corriendo y las credenciales sean correctas")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    success = setup_complete_test_database()
    exit(0 if success else 1)
