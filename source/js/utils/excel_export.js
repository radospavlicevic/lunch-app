export const tablesToExcel = (() => {
  const uri = 'data:application/vnd.ms-excel;base64,';
  const tmplWorkbookXML = `<?xml version="1.0"?>
    <?mso-application progid="Excel.Sheet"?>
    <Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
    xmlns:o="urn:schemas-microsoft-com:office:office"
    xmlns:x="urn:schemas-microsoft-com:office:excel"
    xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
    xmlns:html="http://www.w3.org/TR/REC-html40">
      <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
        <Author>WorkCo</Author>
        <Version>16.00</Version>
      </DocumentProperties>
      <Styles>
        <Style ss:ID="default">
          <Font ss:FontName="Calibri" x:Family="Swiss" ss:Size="11" ss:Color="#000000"/>
        </Style>
        <Style ss:ID="head">
          <Alignment ss:Vertical="Bottom"/>
          <Borders>
            <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
          </Borders>
          <Font ss:FontName="Calibri" x:Family="Swiss" ss:Size="11" ss:Color="#000000" ss:Bold="1"/>
          <Interior ss:Color="#9BC2E6" ss:Pattern="Solid"/>
        </Style>
        <Style ss:ID="none">
          <Interior ss:Color="#E38888" ss:Pattern="Solid"/>
        </Style>
        <Style ss:ID="bold">
          <Alignment ss:Vertical="Bottom"/>
          <Font ss:FontName="Calibri" x:Family="Swiss" ss:Size="11" ss:Color="#000000" ss:Bold="1"/>
        </Style>
      </Styles>
    {worksheets}</Workbook>`;
  const tmplWorksheetXML = '<Worksheet ss:Name="{nameWS}"><Table>{columns}{rows}</Table></Worksheet>';
  const tmplCellXML = '<Cell{attributeStyleID}><Data ss:Type="{nameType}">{data}</Data></Cell>';
  const base64 = (s) => { return window.btoa(unescape(encodeURIComponent(s))); };
  const format = (s, c) => { return s.replace(/{(\w+)}/g, (m, p) => { return c[p]; }); };
  return function (tables, wsnames, wbname) {
    const styles = ['head', 'bold', 'none'];
    let ctx = '';
    let workbookXML = '';
    let worksheetsXML = '';
    let columnsXML = '';
    let rowsXML = '';

    for (let i = 0; i < tables.length; i++) {
      if (!tables[i].nodeType) tables[i] = document.getElementById(tables[i]); // eslint-disable-line
      for (let j = 0; j < tables[i].rows.length; j++) {
        rowsXML += '<Row>';
        for (let k = 0; k < tables[i].rows[j].cells.length; k++) {
          columnsXML += '<Column ss:Width="100" />';
          const dataStyle = tables[i].rows[j].cells[k].getAttribute('data-style');
          const dataValueInit = tables[i].rows[j].cells[k].getAttribute('data-value');
          const dataValue = dataValueInit || tables[i].rows[j].cells[k].innerHTML;
          ctx = { attributeStyleID: (styles.includes(dataStyle)) ? ` ss:StyleID="${ dataStyle }"` : ' ss:StyleID="default"',
            nameType: 'String',
            data: dataValue,
          };
          rowsXML += format(tmplCellXML, ctx);
        }
        rowsXML += '</Row>';
      }
      ctx = { columns: columnsXML, rows: rowsXML, nameWS: wsnames[i] || `Sheet${ i }` };
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
