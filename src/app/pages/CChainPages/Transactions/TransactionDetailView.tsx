import * as React from 'react';
import { Divider, Grid } from '@mui/material';
import OutlinedContainer from 'app/components/OutlinedContainer';
import DetailsField from 'app/components/DetailsField';

function TransactionDetailView({ detailTr, detailCr }) {
  return (
    <>
      {detailTr && (
        <OutlinedContainer>
          <Grid item container alignItems="center">
            <Grid item xs={12}>
              <DetailsField
                field="Type"
                value={detailTr['type']}
                type="ctxtype"
              />
              <Divider variant="fullWidth" />
            </Grid>
            <Grid item xs={12}>
              <DetailsField
                field="Block"
                value={detailTr['block']}
                type="string"
                detailsLink={`/c-chain/blocks/${detailTr.block}`}
              />
              <Divider variant="fullWidth" />
            </Grid>
            <Grid item xs={12}>
              <DetailsField
                field="Timestamp"
                value={detailTr['createdAt'].toString()}
                type="timestamp"
                tooltip="date"
              />
              <Divider variant="fullWidth" />
            </Grid>
            <Grid item xs={12}>
              <DetailsField
                field="From"
                value={detailTr['fromAddr']}
                type="hexdata"
                allowCopy={true}
              />
              <Divider variant="fullWidth" />
            </Grid>
            <Grid item xs={12}>
              <DetailsField
                field="To"
                value={detailTr['toAddr']}
                type="hexdata"
                allowCopy={true}
              />
            </Grid>
          </Grid>
        </OutlinedContainer>
      )}
      {detailCr && (
        <OutlinedContainer>
          <Grid item container alignItems="center">
            {detailCr['gasPrice'] ? (
              <Grid item xs={12}>
                <DetailsField
                  field="Gas Price"
                  value={detailCr['gasPrice']}
                  type="wei"
                />
                <Divider variant="fullWidth" />
              </Grid>
            ) : (
              <></>
            )}
            {detailCr['maxFeePerGas'] && detailCr['maxPriorityFeePerGas'] ? (
              <>
                <Grid item xs={12}>
                  <DetailsField
                    field="Max fee per gas"
                    value={detailCr['maxFeePerGas']}
                    type="wei"
                  />
                  <Divider variant="fullWidth" />
                </Grid>
                <Grid item xs={12}>
                  <DetailsField
                    field="Max Priority fee per gas"
                    value={detailCr['maxPriorityFeePerGas']}
                    type="wei"
                  />
                  <Divider variant="fullWidth" />
                </Grid>
              </>
            ) : (
              <></>
            )}
            <Grid item xs={12}>
              <DetailsField
                field="Gas Used"
                value={detailCr['gasUsed']}
                type="number"
              />
              <Divider variant="fullWidth" />
            </Grid>
            <Grid item xs={12}>
              <DetailsField
                field="Effective Gas Price"
                value={detailCr['effectiveGasPrice']}
                type="wei"
              />
              <Divider variant="fullWidth" />
            </Grid>
            <Grid item xs={12}>
              <DetailsField
                field="Transaction Cost"
                value={detailCr['transactionCost']}
                type="wei"
              />
            </Grid>
          </Grid>
        </OutlinedContainer>
      )}
    </>
  );
}

export default React.memo(TransactionDetailView);
