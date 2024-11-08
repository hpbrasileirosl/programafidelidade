/**
 * 
 * @On(event = { "CREATE" }, entity = "programadefidelidadeSrv.Redemptions")
 * @param {Object} request - User information, tenant-specific CDS model, headers and query parameters
*/
module.exports = async function(request) {
    const { Redemptions, Customers } = cds.entities;

    const redemptionData = request.data;

    if (!redemptionData || !redemptionData.customer_ID || !redemptionData.redeemedAmount) {
        return request.error(400, 'Invalid redemption data');
    }

    // Fetch the customer details
    const customer = await SELECT.one.from(Customers).where({ ID: redemptionData.customer_ID });

    if (!customer) {
        return request.error(404, 'Customer not found');
    }

    // Check if the customer has enough reward points
    if (customer.totalRewardPoints < redemptionData.redeemedAmount) {
        return request.error(400, 'Insufficient reward points');
    }

    // Deduct the redeemed amount from the customer's total reward points
    customer.totalRewardPoints -= redemptionData.redeemedAmount;

    // Update the customer's total reward points
    await UPDATE(Customers).set({ totalRewardPoints: customer.totalRewardPoints }).where({ ID: customer.ID });

    // Add the redeemed amount to the customer's total redeemed points
    customer.totalPurchaseValue += redemptionData.redeemedAmount;

    // Update the customer's total redeemed points
    await UPDATE(Customers).set({ totalPurchaseValue: customer.totalPurchaseValue }).where({ ID: customer.ID });
};