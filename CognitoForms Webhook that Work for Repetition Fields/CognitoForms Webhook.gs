//this is a function that fires when the webapp receives a GET request
function doGet(e) {
    return HtmlService.createHtmlOutput("Hello humam, nice to see you...");
    console.log("Logging test");
}
//this is a function that fires when the webapp receives a POST request
function doPost(e) {
//Capturando as informações do arquivo JSON vindo via webhook
    const jsonString = JSON.stringify(e);
    const params = JSON.parse(jsonString);
    const data = JSON.parse(params.postData.contents);
    const {
        Id,
        Email,
        IdentificaçãoEmpresanúmero,
        NúmeroDaSolicitação,
        CódigoDoContratonúmero,
        DiagnósticoDoProblema,
        ValorTotalDoOrçamento,
        AceitaParcelar,
        Garantiameses,
        PrazoDeExecuçãodias,
        Observações
    } = data;
    //Formula de loop para pegar infos do campo de repetição
    const descricaoDoServico = data.Orçamento.map(entry => {
    const {
        ItemNumber,
        TipoDeServiço,
        Quantidade,
        MateriaisR,
        MãoDeObraR,
        Detalhamento,
    } = entry;
    //Formatando como cada linha do campo de repetição será apresentada 
    return ItemNumber + " - " + TipoDeServiço + " (" + Quantidade + ") - mat:R$" + MateriaisR + " / mdo:R$" + MãoDeObraR + "\n\t\t" + Detalhamento;
    }).join('\n');
    //Timestamp do momento da captura
    const timestamp = Utilities.formatDate(new Date(), "GMT-3:00", "MM/dd/yyyy HH:mm:ss");
    //Abaixo estão declaradas as informações que devem ser colocadas na planilha e suas respectivas colunas
    const dataArray = [
        timestamp,
        Email,
        IdentificaçãoEmpresanúmero,
        NúmeroDaSolicitação,
        CódigoDoContratonúmero,
        DiagnósticoDoProblema,
        descricaoDoServico,
        ValorTotalDoOrçamento,
        AceitaParcelar,
        Garantiameses,
        Observações,
        PrazoDeExecuçãodias,
        Id,
        params
    ];
    //Declarando em qual aba escrever as informações
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("CognitoForms"); //nome da aba
    const lastRow = Math.max(sheet.getLastRow(),1);
    sheet.insertRowAfter(lastRow + 1);
    sheet.getRange(lastRow + 1,1,1,dataArray.length).setValues([dataArray]);
    SpreadsheetApp.flush();
    console.log("Post request received");
}