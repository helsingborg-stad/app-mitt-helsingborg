export const validatePno = (pno) => {
    const pnoRegex = /^[0-9]{12}$/;
    return pnoRegex.test(pno);
};
