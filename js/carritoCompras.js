let products;



// Carrito de compras almacenado en localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let cardName = ""; // Variable para almacenar el nombre de la tarjeta
let customerName = ""; // Variable para almacenar el nombre del cliente

// Función para guardar el carrito en localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartIndicator();
}

// Función para mostrar el indicador del carrito
function updateCartIndicator() {
    let cartQuantity = cart.length;
    document.getElementById("carritoDeComprasIndicador").dataset.quantity = cartQuantity;
    document.querySelector("#carritoDeComprasIndicador .quantity").textContent = cartQuantity;
}



// Función para agregar productos al carrito
function addToCart(productId) {
    const product = products.find(p => p.codigo === productId);
    const cartItem = cart.find(item => item.codigo === productId);

    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    //Swal.fire('Producto agregado', `${product.name} ha sido agregado al carrito`, 'success');
}

// Función para mostrar el carrito de compras
function displayCart() {
    const content = $("#content");
    content.empty();

    if (cart.length === 0) {
    content.append(`
        <br><br><br>
        <h1 class="text-center">
            No posees artículos en tu carrito.
            <br><br>
            ¡Te invitamos a comprar uno de nuestros ejemplares!
        </h1>
        <br><br><br>
        <div class="fullscreen-center">
            <a href="index.html#bonsais" class="btn btn-primary">
                Dando clic aquí
            </a>
        </div>
    `);
    return;
}

    


    content.append('</br></br></br><h1 class="text-center">Carrito de Compras</h1>');

    // Agregar campo para el nombre del cliente
    content.append(`
            <div class="form-group">
                <label for="customer-name">Nombre del Cliente:</label>
                <input type="text" id="customer-name" class="form-control" placeholder="Ingresa tu nombre" value="Contado" oninput="customerName = this.value">
            </div>
        `);

    const cartTable = `
        <div class="table-responsive">
            <table class="table table-bordered" id="cart-table">
                <thead>
                    <tr>
                        <th>Bonsai</th>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Cantidad</th>
                        <th>Subtotal</th>
                        <th>Eliminar</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
        <h4>Total: $<span id="total-price">0.00</span></h4>
        <button class="buttonCategories mx-auto d-block" style = "width : 30%; margin-top: 8%" onclick="simulatePayment()">Pagar</button>
        </br>
        </br>
        <button class="buttonCategories mx-auto d-block" style = "width : 30%; margin-top: -10%" onclick="generatePDF()">Imprimir Factura</button>
    `;

    content.append(cartTable);

    const cartTableBody = $("#cart-table tbody");
    let total = 0;

    cart.forEach(item => {
        const subtotal = item.precio * item.quantity;
        total += subtotal;
        console.log(item);
        cartTableBody.append(`
            <tr>
                <td style="background-image:url(${item.imagen});background-repeat:no-repeat;background-size:cover;width:180px;height:100px;"></td>
                <td>${item.nombre}</td>
                <td style = "text-align: right">$${item.precio.toFixed(2)}</td>
                <td>
                    <input type="number" min="1" class="form-control" value="${item.quantity}" onchange="updateQuantity('${item.codigo}', this.value)">
                </td>
                <td style = "text-align: right">$${subtotal.toFixed(2)}</td>
                <td>
                    <button class="buttonDelete d-block w-100" onclick="removeFromCart('${item.codigo}')">
                        <svg viewBox="0 0 448 512" class="svgIcon"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path></svg>
                    </button>
                </td>
            </tr>
        `);
    });

    $("#total-price").text(total.toFixed(2));

}
// Función para eliminar un producto del carrito
function removeFromCart(productId) {
    cart = cart.filter(item => item.codigo !== productId);

    saveCart();
    displayCart();
    Swal.fire('Producto eliminado', 'El producto ha sido eliminado del carrito', 'info');
}

// Función para actualizar la cantidad de productos
function updateQuantity(productId, quantity) {
    const cartItem = cart.find(item => item.codigo === productId);
    if (cartItem) {
        cartItem.quantity = parseInt(quantity);
        saveCart();
        displayCart();
    }
}



// Función para generar un PDF del contenido del carrito
function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Generar la fecha y hora actual en el formato especificado
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
    const invoiceNumber = `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`;

    // Establecer fondo blanco
    doc.setFillColor(255, 255, 255); // Blanco
    doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');


    const logoX = 14; // Posición X
    const logoY = 10; // Posición Y
    const logoWidth = 50; // Ancho del logo
    const logoHeight = 50; // Alto del logo


    doc.addImage('.\\img\\logoblanco.jpg', 'PNG', logoX, logoY, logoWidth, logoHeight);

    // Espacio adicional después del logo
    let headerY = logoY + logoHeight - 25;

    // Encabezado de la factura
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(133, 156, 73); // Verde oscuro
    doc.text("Factura de Compra", 105, headerY, null, null, 'center');

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Texto negro
    doc.text(`Factura Número: ${invoiceNumber}`, 105, headerY + 10, null, null, 'center');

    // Nombre del cliente
    const customerNameDisplay = customerName.trim() === "" ? "Contado" : customerName;
    doc.text(`Cliente: ${customerNameDisplay}`, 14, headerY + 25);


    let y = headerY + 30;
    let total = 0;

    // Estilo de la tabla
    const tableWidth = 180;
    const rowHeight = 10;

    // Cabecera de la tabla con color verde oscuro
    doc.setFillColor(133, 156, 73); // Verde oscuro
    doc.rect(14, y, tableWidth, rowHeight, 'F');
    doc.setTextColor(255, 255, 255); // Blanco
    doc.setFontSize(10);
    doc.text("Producto", 15, y + 7);
    doc.text("Precio", 75, y + 7);
    doc.text("Cantidad", 115, y + 7);
    doc.text("Subtotal", 145, y + 7);

    // Incrementar la posición para los productos
    y += rowHeight;

    // Detalles de los productos
    cart.forEach(item => {
        const subtotal = item.precio * item.quantity;

        // Filas de la tabla
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0); // Negro
        doc.rect(14, y, tableWidth, rowHeight); // Bordes de la fila

        doc.text(item.nombre, 15, y + 7);
        doc.text(`$${item.precio.toFixed(2)}`, 75, y + 7);
        doc.text(item.quantity.toString(), 115, y + 7);
        doc.text(`$${subtotal.toFixed(2)}`, 145, y + 7);

        y += rowHeight; // Incremento para la siguiente fila
        total += subtotal;
    });

    // Total con fondo dorado
    doc.setFillColor(255, 215, 0); // Dorado
    doc.rect(14, y, tableWidth, rowHeight, 'F');
    doc.setTextColor(0, 0, 0); // Negro
    doc.text("Total:", 15, y + 7);
    doc.text(`$${total.toFixed(2)}`, 145, y + 7);

    // Agregar número de página con texto negro
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i); // Establecer la página actual
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0); // Negro
        doc.text(`Página ${i} de ${pageCount}`, 190, 285, null, null, 'right');
    }

    // Guardar el PDF
    doc.save('factura_compra.pdf');
}





// Función para simular el pago
// Función para detectar el tipo de tarjeta basado en su BIN
function detectCardType(bin) {
    // Validar si el bin es un número válido
    if (!/^\d+$/.test(bin)) {
        return { type: 'Desconocida', logo: '' };
    }

    const cardTypes = [
        { regex: /^4/, type: 'Visa', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png' },
        { regex: /^5[1-5]/, type: 'MasterCard', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg' },
        { regex: /^3[47]/, type: 'American Express', logo: './img/logoAmericanExpress.png' },
        { regex: /^6(?:011|5)/, type: 'Discover', logo: './img/logoDiscover.png' },
        { regex: /^35/, type: 'JCB', logo: './img/logoJCB.png' },
        { regex: /^62/, type: 'UnionPay', logo: './img/logoUNIONPAY.png' },
    ];

    for (const cardType of cardTypes) {
        if (cardType.regex.test(bin)) {
            return { type: cardType.type, logo: cardType.logo };
        }
    }

    return { type: 'Desconocida', logo: '' };
}




// Función para simular el pago con detección del tipo de tarjeta
function simulatePayment() {
    const today = new Date();
    const todayString = today.toISOString().split("T")[0];

    Swal.fire({
        title: 'Pagar',
        html: `
            <input id="card-number" type="text" class="swal2-input" placeholder="Número de tarjeta" maxlength="16" oninput="this.value=this.value.replace(/[^0-9]/g,''); showCardLogo(this.value)">
            <div id="card-logo" style="text-align: center; margin-top: 10px;"></div>
            
            <!-- Label para la fecha de vencimiento con estilo ajustado -->
            <label for="expiry-date" style="display: block; margin-bottom: 5px; font-weight: bold;">Fecha de Vencimiento</label>
            <input id="expiry-date" type="date" class="swal2-input" placeholder="Fecha de Vencimiento" min="${todayString}">
            
            <input id="card-name" type="text" class="swal2-input" placeholder="Nombre en la tarjeta">
        `,
        focusConfirm: false,
        preConfirm: () => {
            const cardNumber = document.getElementById('card-number').value;
            const expiryDate = document.getElementById('expiry-date').value;
            const cardName = document.getElementById('card-name').value;
            const bin = cardNumber.slice(0, 6);
            const { type } = detectCardType(bin);

            if (!cardNumber || !expiryDate || !cardName) {
                Swal.showValidationMessage('Por favor completa todos los campos');
                return false;
            }

            if (cardNumber.length < 13 || cardNumber.length > 16) {
                Swal.showValidationMessage('El número de tarjeta debe tener entre 13 y 16 dígitos');
                return false;
            }

            const selectedDate = new Date(expiryDate);
            if (selectedDate < today) {
                Swal.showValidationMessage('La fecha de vencimiento no puede ser anterior al día actual');
                return false;
            }

            if (type === 'Desconocida') {
                Swal.showValidationMessage('El tipo de tarjeta no es válido');
                return false;
            }

            return { cardNumber, expiryDate, cardName, type };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const { cardNumber, expiryDate, cardName, type } = result.value;
            Swal.fire(
                '¡Pago realizado!',
                `Has pagado con una tarjeta ${type}. Gracias por tu compra.`,
                'success'
            );
            generatePDF();
            cart = [];
            saveCart();
            displayCart();
        }
    });
}



// Función para mostrar el logo de la tarjeta
function showCardLogo(cardNumber) {
    const bin = cardNumber.slice(0, 6);
    const { type, logo } = detectCardType(bin);
    const cardLogoDiv = document.getElementById('card-logo');

    if (logo) {
        cardLogoDiv.innerHTML = `<img src="${logo}" alt="${type} Logo" style="height: 50px;">`;
    } else {
        cardLogoDiv.innerHTML = '';
    }
}



// Eventos de carga inicial

$(document).ready(() => {
    displayCart();
    updateCartIndicator();
    fetch('productos.json')
        .then(response => response.json())
        .then(json => {
            products = Object.freeze(json);

        })
        .catch(error => console.error('Error al cargar JSON', error));
});
