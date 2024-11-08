/**
 * 
 * @On(event = { "CREATE" }, entity = "programadefidelidadeSrv.Purchases")
 * @param {Object} request - User information, tenant-specific CDS model, headers and query parameters
 */
module.exports = async function(request) {
    // Importar las entidades globales disponibles
    const { Customers } = cds.entities;

    // Obtener los datos del cuerpo de la solicitud
    const purchaseData = request.data;

    // Verificar si los datos de la compra están definidos
    if (!purchaseData || !purchaseData.purchaseValue || !purchaseData.customer_ID) {
        return;
    }

    // Calcular los puntos de recompensa como una décima parte del valor de la compra
    const rewardPoints = Math.floor(purchaseData.purchaseValue / 10);

    // Actualizar los puntos de recompensa en los datos de la compra
    purchaseData.rewardPoints = rewardPoints;

    // Obtener el cliente relacionado con la compra
    const customer = await SELECT.one.from(Customers).where({ ID: purchaseData.customer_ID });

    // Verificar si el cliente existe
    if (!customer) {
        return;
    }

    // Actualizar el valor total de compras y los puntos de recompensa totales del cliente
    const updatedCustomer = {
        totalPurchaseValue: (customer.totalPurchaseValue || 0) + purchaseData.purchaseValue,
        totalRewardPoints: (customer.totalRewardPoints || 0) + rewardPoints
    };

    // Actualizar la entidad Customers con los nuevos valores
    await UPDATE(Customers).set(updatedCustomer).where({ ID: purchaseData.customer_ID });
};