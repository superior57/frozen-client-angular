import { AccountEntry, AccountEntryType } from 'src/app/finance/model';
import { AccountDispatchSetting } from './account-disatch-setting';
import { TreasuryAccount } from './treasury-account';

export interface EntryDispatchData {
  account: string;
  value: number;
  percent?: number;
  fixed?: number;
  accountId?: string;
  children?: EntryDispatchData[];
}

export interface EntryWithDispatch {
  entry: AccountEntry;
  dispatch: EntryDispatchData[];
}

export interface DispatchSettingTakeonField {
  field: string;
  value: string;
}

export interface DispatchSettingPart {
  amount?: number;
  label?: string;
  ratio?: DispatchSettingPart[];
  takeon?: DispatchSettingTakeonField;
}

export interface DispatchSetting {
  fixed?: DispatchSettingPart;
  ratio?: DispatchSettingPart[];
}

export interface AccountDispatchCalculationResult {
  portion: number;
  type: string;
  label: string;
  amount: number;
  codedLabel?: string;
  children?: AccountDispatchCalculationResult[];
  accountId?: number;
}

export const calculateDispatches = (
  dispatchSetting: AccountDispatchSetting,
  entries: AccountEntry[],
  accounts: TreasuryAccount[]
): AccountDispatchCalculationResult[] => {
  if (!entries || entries.length === 0) {
    return [];
  }

  const dispatch = JSON.parse(dispatchSetting.json);
  const remainder: { value: number } = { value: 0 };
  const returnValue: AccountDispatchCalculationResult[] = [];
  const accountId = entries[0]?.accountId;

  returnValue.push(
    ...tryCalculateFixedAmount(dispatch, entries, remainder, accounts)
  ); // Remove the fixed amount and update the remainder
  returnValue.push(
    ...tryCalculatePartialRatio(dispatch, entries, remainder, accounts)
  );
  returnValue.push(
    ...tryCalculateRatio(dispatch, remainder.value, accounts, accountId)
  );

  return returnValue;
};

const tryCalculateFixedAmount = (
  dispatch: DispatchSetting,
  entries: AccountEntry[],
  remainder: { value: number },
  accounts: TreasuryAccount[]
): AccountDispatchCalculationResult[] => {
  if (dispatch.fixed) {
    const fixedAmountValue = dispatch.fixed.amount as number;
    const positiveEntries = entries.filter(
      (entry: AccountEntry) => entry.type === AccountEntryType.ENTREE
    );

    const fixedAmountTotal = fixedAmountValue * positiveEntries.length;
    remainder.value = positiveEntries
      .map((entry: AccountEntry) => entry.prixTotal)
      .reduce(
        (previousValue: number, currentValue: number) =>
          currentValue + previousValue
      );
    remainder.value -= fixedAmountTotal;

    const label = getDispatchLabel(dispatch.fixed.label, accounts);
    return [
      {
        label,
        codedLabel: dispatch.fixed.label,
        amount: fixedAmountTotal,
        portion: dispatch.fixed.amount,
        type: 'Fixe',
        accountId: entries[0].accountId,
      },
    ];
  }
  return [];
};

const getDispatchLabel = (
  codedLabel: string,
  accounts: TreasuryAccount[]
): string => {
  return accounts.find(
    (account: TreasuryAccount) => account.code === codedLabel
  )?.intitule;
};

const tryCalculatePartialRatio = (
  dispatch: DispatchSetting,
  entries: AccountEntry[],
  remainder: { value: number },
  accounts: TreasuryAccount[]
): AccountDispatchCalculationResult[] => {
  if (dispatch.ratio) {
    return pickPartialRatioFromRatios(
      dispatch.ratio,
      entries,
      remainder,
      accounts
    );
  }
  return [];
};

const pickPartialRatioFromRatios = (
  ratios: DispatchSettingPart[],
  entries: AccountEntry[],
  remainder: { value: number },
  treasuryAccounts: TreasuryAccount[]
): AccountDispatchCalculationResult[] => {
  const returnValue: AccountDispatchCalculationResult[] = [];

  ratios.forEach((ratio: DispatchSettingPart) => {
    if (ratio.takeon) {
      let percentValue = 0;
      entries.forEach((entry: AccountEntry) => {
        if (entry[ratio.takeon.field] === ratio.takeon.value) {
          const percentile = (entry.prixTotal * ratio.amount) / 100;
          percentValue += percentile;
          entry.prixTotal -= percentile;
        }
      });
      remainder.value -= percentValue;
      returnValue.push({
        amount: percentValue,
        label: getDispatchLabel(ratio.label, treasuryAccounts),
        codedLabel: ratio.label,
        portion: ratio.amount,
        type: 'Pourcentage',
        accountId: entries[0].accountId,
      });
    }
  });
  return returnValue;
};

const tryCalculateRatio = (
  dispatch: DispatchSetting,
  remainder: number,
  accounts: TreasuryAccount[],
  accountId: number
): AccountDispatchCalculationResult[] => {
  if (dispatch.ratio) {
    const returnValue: AccountDispatchCalculationResult[] = [];
    dispatch.ratio.forEach((ratio: DispatchSettingPart) => {
      returnValue.push(
        ...calculateDispatchRatio(ratio, remainder, accounts, accountId)
      );
    });
    return returnValue;
  }
  return [];
};

const calculateDispatchRatio = (
  ratio: DispatchSettingPart,
  amount: number,
  accounts: TreasuryAccount[],
  accountId: number
): AccountDispatchCalculationResult[] => {
  if (ratio) {
    if (ratio.amount && ratio.label) {
      return calculateSingleDispatchRatio(ratio, amount, accounts, accountId);
    } else if (ratio.amount && ratio.ratio) {
      return [
        {
          amount: (amount * ratio.amount) / 100,
          label: 'Sous répartition',
          portion: ratio.amount,
          type: 'Pourcentage',
          children: calculateMultipleDispatchRatios(
            ratio,
            amount,
            accounts,
            accountId
          ),
          accountId,
        },
      ];
    }
  }
  return [];
};

const calculateSingleDispatchRatio = (
  ratio: DispatchSettingPart,
  amount: number,
  accounts: TreasuryAccount[],
  accountId: number
): AccountDispatchCalculationResult[] => {
  const ratioValue: number = (amount * ratio.amount) / 100;
  const label = getDispatchLabel(ratio.label, accounts);
  return [
    {
      amount: ratioValue,
      label,
      codedLabel: ratio.label,
      portion: ratio.amount,
      type: 'Pourcentage',
      accountId,
    },
  ];
};

const calculateMultipleDispatchRatios = (
  ratio: DispatchSettingPart,
  amount: number,
  accounts: TreasuryAccount[],
  accountId: number
): AccountDispatchCalculationResult[] => {
  const returnValue: AccountDispatchCalculationResult[] = [];
  ratio.ratio.forEach((subRatio: DispatchSettingPart) => {
    returnValue.push(
      ...calculateDispatchRatio(
        subRatio,
        (amount * ratio.amount) / 100,
        accounts,
        accountId
      )
    );
  });

  return returnValue;
};

export const calculateDispatchesForIndividualEntries = (
  dispatchSetting: AccountDispatchSetting,
  entries: AccountEntry[],
  accounts: TreasuryAccount[]
): EntryWithDispatch[] => {
  if (!entries || entries.length === 0) {
    return [];
  }

  const dispatch = JSON.parse(dispatchSetting.json);
  const returnValue: EntryWithDispatch[] = [];

  entries.forEach((entry) => {
    const remainder: { value: number } = { value: 0 };
    const accountId = entry.accountId;

    const result = tryCalculateFixedAmountOnSingleEntry(
      dispatch,
      entry,
      remainder,
      accounts
    );
    tryCalculatePartialRatioOnSingleEntry(
      dispatch,
      result,
      remainder,
      accounts
    );
    tryCalculateRatioOnSingleEntry(dispatch, result, remainder.value, accounts);
    returnValue.push(result);
  });

  return returnValue;
};

const tryCalculateFixedAmountOnSingleEntry = (
  dispatch: DispatchSetting,
  entry: AccountEntry,
  remainder: { value: number },
  accounts: TreasuryAccount[]
): EntryWithDispatch => {
  if (dispatch.fixed) {
    const label = getDispatchLabel(dispatch.fixed.label, accounts);
    remainder.value = entry.prixTotal - dispatch.fixed.amount;

    return {
      entry,
      dispatch: [
        {
          account: label,
          value: dispatch.fixed.amount,
          fixed: dispatch.fixed.amount,
        },
      ],
    };
  }
  return null;
};

const tryCalculatePartialRatioOnSingleEntry = (
  dispatch: DispatchSetting,
  entry: EntryWithDispatch,
  remainder: { value: number },
  accounts: TreasuryAccount[]
): void => {
  if (dispatch.ratio) {
    pickPartialRatioFromRatiosOnSingleEntry(
      dispatch.ratio,
      entry,
      remainder,
      accounts
    );
  }
};

const pickPartialRatioFromRatiosOnSingleEntry = (
  ratios: DispatchSettingPart[],
  entry: EntryWithDispatch,
  remainder: { value: number },
  treasuryAccounts: TreasuryAccount[]
): void => {
  ratios.forEach((ratio: DispatchSettingPart) => {
    if (ratio.takeon) {
      if (entry[ratio.takeon.field] === ratio.takeon.value) {
        const amount = (remainder.value * ratio.amount) / 100;
        remainder.value -= amount;
        entry.dispatch.push({
          account: getDispatchLabel(ratio.label, treasuryAccounts),
          value: amount,
          percent: ratio.amount,
        });
      }
    }
  });
};

const tryCalculateRatioOnSingleEntry = (
  dispatch: DispatchSetting,
  entry: EntryWithDispatch,
  remainder: number,
  accounts: TreasuryAccount[]
): void => {
  if (dispatch.ratio) {
    dispatch.ratio.forEach((ratio: DispatchSettingPart) => {
      calculateDispatchRatioOnSingleEntry(ratio, entry, remainder, accounts);
    });
  }
};

const calculateDispatchRatioOnSingleEntry = (
  ratio: DispatchSettingPart,
  entry: EntryWithDispatch | EntryDispatchData,
  amount: number,
  accounts: TreasuryAccount[]
): void => {
  if (ratio) {
    if (ratio.amount && ratio.label) {
      calculateSingleDispatchRatioOnSingleEntry(ratio, entry, amount, accounts);
    } else if (ratio.amount && ratio.ratio) {
      const compositeDispatch = {
        account: 'Sous répartition',
        accountId: `${Math.random()}`,
        value: null,
        children: [],
        percent: ratio.amount,
      };

      if (Object.keys(entry).includes('children')) {
        (entry as EntryDispatchData).children.push(compositeDispatch);
      } else {
        (entry as EntryWithDispatch).dispatch.push(compositeDispatch);
      }
      calculateMultipleDispatchRatiosOnSingleEntry(
        ratio,
        compositeDispatch,
        amount,
        accounts
      );
    }
  }
};

const calculateSingleDispatchRatioOnSingleEntry = (
  ratio: DispatchSettingPart,
  entry: EntryWithDispatch | EntryDispatchData,
  amount: number,
  accounts: TreasuryAccount[]
): void => {
  const ratioValue: number = (amount * ratio.amount) / 100;
  const label = getDispatchLabel(ratio.label, accounts);
  const dispatch = {
    account: label,
    value: ratioValue,
    percent: ratio.amount,
    accountId: ratio.label,
  };

  if (!Object.keys(entry).includes('children')) {
    (entry as EntryWithDispatch).dispatch.push(dispatch);
  } else {
    (entry as EntryDispatchData).children.push(dispatch);
  }
};

const calculateMultipleDispatchRatiosOnSingleEntry = (
  ratio: DispatchSettingPart,
  entry: EntryWithDispatch | EntryDispatchData,
  amount: number,
  accounts: TreasuryAccount[]
): void => {
  ratio.ratio.forEach((subRatio: DispatchSettingPart) => {
    calculateDispatchRatioOnSingleEntry(
      subRatio,
      entry,
      (amount * ratio.amount) / 100,
      accounts
    );
  });
};
