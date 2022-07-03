import * as React from 'react';
import { Helmet } from 'react-helmet-async';

import {
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { ListCard } from 'app/components/LatestBlocksAndTransactionsList';
import { selectAllBlocks } from 'store/cchainSlice';
import { useSelector } from 'react-redux';
// import ColumnGroupingTable from './Table';
import axios from 'axios';
import { BlockTableData } from '../../../store/cchainSlice/types';
import { useEffectOnce } from 'app/hooks/useEffectOnce';
import { TableCellProps } from '@mui/material';
import { getRelativeTime } from 'utils/display/display-utils';

export async function loadBlocksAndTransactions(
  startingBlock = NaN,
  endingBlock = NaN,
  transactionId = 0,
  blockCount = 10,
  transactionCount = 0,
) {
  console.log(startingBlock);
  return await axios.get(
    `https://magellan.columbus.camino.foundation/v2/cblocks?limit=${50}&limit=${transactionCount}&blockStart=${startingBlock}&blockEnd=${endingBlock}&transactionId=${transactionId}`,
  );
}

export async function loadBlocks(startBlock) {
  let res = (await loadBlocksAndTransactions(startBlock)).data;
  return res.blocks.map(block => {
    return {
      hash: block.hash,
      number: parseInt(block.number),
      timestamp: new Date(block.timestamp * 1000),
      gasLimit: parseInt(block.gasLimit),
      gasUsed: parseInt(block.gasUsed),
      numberOfTransactions: block.evmTx ? block.evmTx : 0,
      blockCost: parseInt(block.gasUsed) * parseInt(block.baseFeePerGas),
    };
  });
}

export interface ColumnType {
  name: string;
  label: string;
  field: string;
  minWidth: number;
  align: TableCellProps['align'];
}

const columns: ColumnType[] = [
  {
    name: 'block',
    label: 'Block',
    field: 'number',
    minWidth: 170,
    align: 'left',
  },
  {
    name: 'age',
    label: 'Age',
    field: 'timestamp',
    minWidth: 170,
    align: 'right',
  },
  {
    name: 'transactions',
    label: '# of tx',
    field: 'numberOfTransactions',
    align: 'right',
    minWidth: 170,
  },
  {
    name: 'hash',
    label: 'Hash',
    field: 'hash',
    align: 'center',
    minWidth: 170,
  },
  {
    name: 'gasUsed',
    minWidth: 170,
    label: 'Gas Used',
    field: 'gasUsed',
    align: 'right',
  },
  {
    minWidth: 170,
    name: 'gasLimit',
    label: 'Gas Limit',
    field: 'gasLimit',
    align: 'right',
  },
];

export function CChainPageBlocks() {
  const tableEl = React.useRef<HTMLDivElement>(null);
  const blocks = useSelector(selectAllBlocks);
  const theme = useTheme();
  const isMobile = useMediaQuery('@media (max-width:899px)');
  const [distanceBottom, setDistanceBottom] = React.useState(0);
  const [hasMore] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [rows, setRows] = React.useState<BlockTableData[]>([]);

  const loadMore = React.useCallback(() => {
    setLoading(true);
    loadItems();
  }, [rows]);

  const loadItems = async () => {
    await new Promise<void>(resolve => {
      loadBlocks(rows[rows.length - 1].number - 1).then(res => {
        setRows([...rows, ...res]);
        setLoading(false);
        resolve();
      });
    });
  };
  const scrollListener = React.useCallback(() => {
    if (tableEl && tableEl.current && tableEl.current) {
      let bottom =
        tableEl?.current?.scrollHeight - tableEl?.current?.clientHeight;
      if (!distanceBottom) {
        // calculate distanceBottom that works for you
        setDistanceBottom(Math.round((bottom / 100) * 20));
      }
      if (
        tableEl.current.scrollTop > bottom - distanceBottom &&
        hasMore &&
        !loading
      ) {
        loadMore();
      }
    }
  }, [hasMore, loadMore, loading, distanceBottom]);
  React.useLayoutEffect(() => {
    const tableRef = tableEl.current;
    tableRef?.addEventListener('scroll', scrollListener);
    return () => {
      tableRef?.removeEventListener('scroll', scrollListener);
    };
  }, [scrollListener]);
  useEffectOnce(() => {
    loadBlocks(NaN as number).then(res => {
      setRows(res);
    });
  });
  return (
    <Container maxWidth="xl">
      <Helmet>
        <title>c-chain</title>
        <meta name="description" content="blocks c-chain" />
      </Helmet>
      {/* <Grid
        container
        rowSpacing={{ xs: 4, lg: '0!important' }}
        columnSpacing={{ xs: 0, lg: 4 }}
      >
        {blocks && blocks.length > 0 && (
          <Grid item xs={12} lg={12}>
            <ListCard
              title="Latest Blocks"
              items={blocks}
              to="/c-chain/blocks"
            />
            <ColumnGroupingTable />
          </Grid>
        )}
      </Grid> */}
      <Grid
        container
        rowSpacing={{ xs: 4, lg: '0!important' }}
        columnSpacing={{ xs: 0, lg: 4 }}
      >
        <Grid item xs={12} lg={12}>
          <Paper
            variant="outlined"
            square
            sx={{
              backgroundColor: 'primary.dark',
              borderRadius: '12px',
              borderWidth: '1px',
              borderColor: 'primary.light',
              borderStyle: 'solid',
              p: '1.5rem 2rem 1.5rem 2rem',
              [theme.breakpoints.down('md')]: {
                p: '1rem 1.5rem 1rem 1.5rem',
              },
            }}
          >
            <TableContainer sx={{ height: '500px' }} ref={tableEl}>
              <Table stickyHeader aria-label="caption table">
                <TableHead>
                  <TableRow>
                    {columns.map(column => (
                      <TableCell
                        key={column.name}
                        align={column.align}
                        style={{ top: 0, minWidth: column.minWidth }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows?.map((row, index) => {
                    return (
                      <TableRow
                        key={index}
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {row.number}
                        </TableCell>
                        <TableCell align="right">
                          {getRelativeTime(row.timestamp) + ' ago'}
                        </TableCell>
                        <TableCell align="right">
                          {row.numberOfTransactions}
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body1" noWrap={true}>
                            {row.hash}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">{row.gasUsed}</TableCell>
                        <TableCell align="right">{row.gasLimit}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
