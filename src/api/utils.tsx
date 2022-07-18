import { XPTransaction, XPTransactionTableData } from 'types/transaction';

function getValue(outputTotal?: object, inputTotal?: object): number {
  const output = outputTotal
    ? Object.entries(outputTotal)
        .map(([, value]) => parseInt(value))
        .reduce((pv, cv) => pv + cv, 0)
    : 0;
  const input = inputTotal
    ? Object.entries(inputTotal)
        .map(([, value]) => parseInt(value))
        .reduce((pv, cv) => pv + cv, 0)
    : 0;
  return output - input;
}

export function mapToTableData(
  transaction: XPTransaction,
): XPTransactionTableData {
  return {
    from: transaction.from,
    hash: transaction.id,
    type: transaction.type,
    timestamp: transaction.timestamp,
    to: transaction.to,
    value: getValue(transaction.outputTotals, transaction.inputTotals),
    fee: transaction.fee,
  };
}
