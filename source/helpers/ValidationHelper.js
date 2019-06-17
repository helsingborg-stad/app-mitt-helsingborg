export const validatePno = (pno) => {
    const pnoRegex = /^[0-9]{12}$/;
    return pnoRegex.test(pno);
};

export const sanitizePno = (pno) => {
    // Remove non digits
    pno = pno.replace(/\D/g, '');
    // Automatically prefix personal number with century
    pno = (pno.length === 2 && pno > 19 && pno != 20) ? 19 + pno : pno;
    pno = (pno.length === 2 && pno < 19) ? 20 + pno : pno;

    return pno;
}
