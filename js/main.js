/// Función principal para consultar recetas basadas en el ingrediente ingresado
function obtenerRecetas() {

    // Realiza una solicitud AJAX para obtener recetas desde la API
    $.ajax({
        // URL de la API para buscar recetas por ingrediente
        url: "https://www.themealdb.com/api/json/v1/1/filter.php",
        // El tipo de solicitud es GET para recuperar datos
        type: "get",
        // El formato de respuesta esperado es JSON
        datatype: "json",

        // Parámetros de la solicitud: ingrediente ingresado por el usuario
        data: {
            i: $("#search-input").val()
        },

        // Función que se ejecuta si la solicitud tiene éxito
        success: function (response) {
            
            // Verifica si hay recetas en la respuesta de la API
            if (response.meals) {

                // Almacena las recetas en una variable
                let listaRecetas = response.meals;

                // Limpia los resultados anteriores antes de mostrar nuevos
                $("#recipe-list").html(""); 

                // Recorre cada receta obtenida y la muestra en el HTML
                $.each(listaRecetas, function (index, item) {

                    // Agrega cada receta a la lista en formato de tarjeta (Bootstrap)
                    $("#recipe-list").append(`
                        <div class="col-md-3">
                            <div class="card mb-3">
                                <img class="card-img-top" src="${item.strMealThumb}" alt="${item.strMeal}">
                                <div class="card-body">
                                    <h5 class="card-title">${item.strMeal}</h5>
                                    <button class="btn btn-dark" onclick="mostrarDetalles('${item.idMeal}')">Ver Receta</button>
                                </div>
                            </div>
                        </div>
                    `);
                });

                // Limpia el campo de búsqueda después de procesar la solicitud
                $("#search-input").val("");

            } else {
                // Si no se encuentran recetas, muestra un mensaje de error
                $("#recipe-list").html(`
                    <div class="col">
                        <h1 class="text-center">No se encontró ninguna receta. Intenta buscar el ingrediente en inglés.</h1>
                    </div>
                `);
            }
        }
    });
}

// Función para obtener y mostrar los detalles de una receta seleccionada
function mostrarDetalles(idReceta) {

    // Realiza una solicitud AJAX para obtener los detalles de la receta por su ID
    $.ajax({
        // URL de la API para buscar detalles de una receta por ID
        url: "https://www.themealdb.com/api/json/v1/1/lookup.php",
        // El tipo de solicitud es GET para recuperar datos
        type: "get",
        // El formato de respuesta esperado es JSON
        datatype: "json",

        // Parámetro: ID de la receta
        data: {
            i: idReceta
        },

        // Función que se ejecuta si la solicitud tiene éxito
        success: function (response) {

            // Verifica si la receta fue encontrada
            if (response.meals) {

                // Almacena los detalles de la receta
                let detallesReceta = response.meals[0];

                // Actualiza el contenido del modal con los detalles de la receta
                $("#recipe-title").text(detallesReceta.strMeal);
                $("#recipe-image").attr("src", detallesReceta.strMealThumb);
                $("#recipe-instructions").text(detallesReceta.strInstructions);

                // Muestra el modal con la información de la receta
                $("#recipeModal").modal("show");
            }
        }
    });
}

// Evento para ejecutar la búsqueda de recetas al hacer clic en el botón
$("#search-button").on("click", function () {
    obtenerRecetas();
});

// Evento para buscar recetas al presionar Enter en el campo de búsqueda
$("#search-input").on("keyup", function (e) {
    if (e.keyCode === 13) {
        obtenerRecetas();
    }
});
