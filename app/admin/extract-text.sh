#!/bin/bash
# Este script recorre recursivamente el directorio actual y, para cada archivo de tipo texto,
# añade una cabecera con la ruta y nombre del archivo y su contenido en output/project_content.txt.
# Se excluye el directorio 'output' para evitar procesar el archivo de salida.

OUTPUT_DIR="./output"
OUTPUT_FILE="$OUTPUT_DIR/project_content.txt"

# Creamos el directorio de salida si no existe
mkdir -p "$OUTPUT_DIR"

# Limpiamos el archivo de salida si ya existe
> "$OUTPUT_FILE"

# Encuentra todos los archivos, excluyendo el directorio de salida para evitar procesarlo
find . -path "$OUTPUT_DIR" -prune -o -type f -print | while IFS= read -r file; do
    # Usamos 'file' para determinar el MIME type y comprobamos que empiece por "text/"
    mime=$(file -b --mime-type "$file")
    if [[ $mime == text/* ]]; then
        echo "----- File: $file -----" >> "$OUTPUT_FILE"
        cat "$file" >> "$OUTPUT_FILE"
        echo -e "\n\n" >> "$OUTPUT_FILE"
    fi
done

echo "Contenido extraído en: $OUTPUT_FILE"
