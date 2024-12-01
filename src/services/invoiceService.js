import Invoice from '../models/invoiceModel.js';

/**
 * Lấy danh sách hóa đơn của người dùng.
 * @param {String} userId - ID của người dùng.
 * @returns {Array} - Danh sách hóa đơn.
 */
export const getUserInvoices = async (userId) => {
    return await Invoice.find({ userId });
};

/**
 * Cập nhật trạng thái hóa đơn.
 * @param {String} invoiceId - ID của hóa đơn.
 * @param {String} status - Trạng thái mới.
 * @returns {Object} - Hóa đơn đã cập nhật.
 */
export const updateInvoiceStatus = async (invoiceId, status) => {
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
        throw new Error('Hóa đơn không tồn tại');
    }

    invoice.status = status;
    await invoice.save();
    return invoice;
};
