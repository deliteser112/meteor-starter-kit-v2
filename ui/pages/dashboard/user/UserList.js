import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// material
import {
  Card,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  Switch,
  Box,
  FormControlLabel,
  Tooltip,
  IconButton
} from '@mui/material';
// hooks
import useTable, { getComparator, emptyRows } from '../../../hooks/useTable';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';

// components
import Scrollbar from '../../../components/Scrollbar';
import Iconify from '../../../components/Iconify';
import {
  TableNoData,
  TableSkeleton,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedActions
} from '../../../components/table';
// sections
import { UserTableRow, UserTableToolbar } from '../../../sections/@dashboard/user-list';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'emailAddress', label: 'Email', alignRight: false },
  { id: 'loggedWith', label: 'Logged With', alignRight: false },
  { id: 'verified', label: 'Email Verified', alignRight: false },
  { id: '' }
];

export default function UserList({ isLoading, userList, onDeleteRow }) {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage
  } = useTable({
    defaultOrderBy: 'name'
  });
  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);
  const [filterName, setFilterName] = useState('');

  useEffect(() => {
    if (userList.length) {
      setTableData(userList);
    }
  }, [userList]);

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleDeleteRows = (selected) => {
    const deleteRows = tableData.filter((row) => !selected.includes(row._id));
    setSelected([]);
    setTableData(deleteRows);
  };

  const handleEditRow = (id) => {
    navigate(PATH_DASHBOARD.user.edit(id));
  };

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName
  });

  const denseHeight = dense ? 60 : 80;

  const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);

  return (
    <Card>
      <UserTableToolbar filterName={filterName} onFilterName={handleFilterName} />

      <Scrollbar>
        <TableContainer sx={{ minWidth: 960, position: 'relative' }}>
          {selected.length > 0 && (
            <TableSelectedActions
              dense={dense}
              numSelected={selected.length}
              rowCount={tableData.length}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  tableData.map((row) => row._id)
                )
              }
              actions={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={() => handleDeleteRows(selected)}>
                    <Iconify icon={'eva:trash-2-outline'} />
                  </IconButton>
                </Tooltip>
              }
            />
          )}

          <Table size={dense ? 'small' : 'medium'}>
            <TableHeadCustom
              order={order}
              orderBy={orderBy}
              headLabel={TABLE_HEAD}
              rowCount={tableData.length}
              numSelected={selected.length}
              onSort={onSort}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  tableData.map((row) => row._id)
                )
              }
            />

            <TableBody>
              {(isLoading ? [...Array(rowsPerPage)] : dataFiltered)
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) =>
                  row ? (
                    <UserTableRow
                      key={index}
                      row={row}
                      selected={selected.includes(row._id)}
                      onSelectRow={() => onSelectRow(row._id)}
                      onDeleteRow={() => onDeleteRow(row._id)}
                      onEditRow={() => handleEditRow(row._id)}
                    />
                  ) : (
                    !isNotFound && <TableSkeleton key={index} sx={{ height: denseHeight }} />
                  )
                )}

              <TableEmptyRows height={denseHeight} emptyRows={emptyRows(page, rowsPerPage, tableData.length)} />

              <TableNoData isNotFound={isNotFound} />
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>

      <Box sx={{ position: 'relative' }}>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={dataFiltered.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={onChangePage}
          onRowsPerPageChange={onChangeRowsPerPage}
        />

        <FormControlLabel
          control={<Switch checked={dense} onChange={onChangeDense} />}
          label="Dense"
          sx={{ px: 3, py: 1.5, top: 0, position: { md: 'absolute' } }}
        />
      </Box>
    </Card>
  );
}

UserList.propTypes = {
  isLoading: PropTypes.bool,
  userList: PropTypes.array,
  onDeleteRow: PropTypes.func
};

// ----------------------------------------------------------------------

function applySortFilter({ tableData, comparator, filterName }) {
  const stabilizedThis = tableData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  tableData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    tableData = tableData.filter((item) => item.emailAddress.toLowerCase().indexOf(filterName.toLowerCase()) !== -1);
  }

  return tableData;
}