export const tablesToExcel = (() => {
  const uri = 'data:application/vnd.ms-excel;base64,';
  const tmplWorkbookXML = '<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?>, \
    <Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">, \
      <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">, \
        <Author>Work&Co</Author>, \
        <Created>{created}</Created>, \
      </DocumentProperties>, \
    <Styles>, \
      <Style ss:ID="Currency"><NumberFormat ss:Format="Currency"></NumberFormat></Style>, \
      <Style ss:ID="Date"><NumberFormat ss:Format="Medium Date"></NumberFormat></Style>, \
    </Styles>, \
    {worksheets}</Workbook>';
  const tmplWorksheetXML = '<Worksheet ss:Name="{nameWS}"><Table>{rows}</Table></Worksheet>';
  const tmplCellXML = '<Cell{attributeStyleID}{attributeFormula}><Data ss:Type="{nameType}">{data}</Data></Cell>';
  const base64 = (s) => { return window.btoa(unescape(encodeURIComponent(s))); };
  const format = (s, c) => { return s.replace(/{(\w+)}/g, (m, p) => { return c[p]; }); };
  return function (tables, wsnames, wbname, appname) {
    let ctx = '';
    let workbookXML = '';
    let worksheetsXML = '';
    let rowsXML = '';

    for (let i = 0; i < tables.length; i++) {
      if (!tables[i].nodeType) tables[i] = document.getElementById(tables[i]); // eslint-disable-line
      for (let j = 0; j < tables[i].rows.length; j++) {
        rowsXML += '<Row>';
        for (let k = 0; k < tables[i].rows[j].cells.length; k++) {
          const dataType = tables[i].rows[j].cells[k].getAttribute('data-type');
          const dataStyle = tables[i].rows[j].cells[k].getAttribute('data-style');
          const dataValueInit = tables[i].rows[j].cells[k].getAttribute('data-value');
          const dataValue = dataValueInit || tables[i].rows[j].cells[k].innerHTML;
          const dataFormulaInit = tables[i].rows[j].cells[k].getAttribute('data-formula');
          const dataFormula = dataFormulaInit || (appname === 'Calc' && dataType === 'DateTime' && dataValue) || null;
          ctx = { attributeStyleID: (dataStyle === 'Currency' || dataStyle === 'Date') ? ` ss:StyleID="${ dataStyle }"` : '',
            nameType: (dataType === 'Number' || dataType === 'DateTime' || dataType === 'Boolean' || dataType === 'Error') ? dataType : 'String',
            data: (dataFormula) ? '' : dataValue,
            attributeFormula: (dataFormula) ? ` ss:Formula="${ dataFormula }"` : '',
          };
          rowsXML += format(tmplCellXML, ctx);
        }
        rowsXML += '</Row>';
      }
      ctx = { rows: rowsXML, nameWS: wsnames[i] || `Sheet${ i }` };
      worksheetsXML += format(tmplWorksheetXML, ctx);
      rowsXML = '';
    }
    ctx = { created: (new Date()).getTime(), worksheets: worksheetsXML };
    workbookXML = format(tmplWorkbookXML, ctx);
    const link = document.createElement('A');
    link.href = uri + base64(workbookXML);
    link.download = wbname || 'Workbook.xls';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
})();
