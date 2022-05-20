import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { filter } from 'lodash';
// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';
// components
import Scrollbar from '../../../components/Scrollbar';
import Iconify from '../../../components/Iconify';
import SearchNotFound from '../../../components/SearchNotFound';
import { TableListHead, TableListToolbar, TableMoreMenu } from '../../../sections/@dashboard/table';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// utils
import stringAvatar from '../../../utils/stringAvatar';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'emailAddress', label: 'Email', alignRight: false },
  { id: 'loggedWith', label: 'Logged With', alignRight: false },
  { id: 'verified', label: 'Email Verified', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
      (_user) => _user.emailAddress.toLowerCase().indexOf(query.toLowerCase()) !== -1,
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function UserList({ userList, onDelete }) {
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('emailAddress');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = userList.map((n) => n.emailAddress);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, emailAddress) => {
    const selectedIndex = selected.indexOf(emailAddress);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, emailAddress);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userList.length) : 0;

  const filteredUsers = applySortFilter(userList, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;

  return (
    <Card>
      <TableListToolbar
        numSelected={selected.length}
        filterName={filterName}
        onFilterName={handleFilterByName}
      />

      <Scrollbar>
        <TableContainer sx={{ minWidth: 800 }}>
          <Table>
            <TableListHead
              order={order}
              orderBy={orderBy}
              headLabel={TABLE_HEAD}
              rowCount={userList.length}
              numSelected={selected.length}
              onRequestSort={handleRequestSort}
              onSelectAllClick={handleSelectAllClick}
            />
            <TableBody>
              {filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  const { _id, name, emailAddress, emailVerified, oAuthProvider } = row;
                  const isItemSelected = selected.indexOf(emailAddress) !== -1;

                  return (
                    <TableRow
                      hover
                      key={_id}
                      tabIndex={-1}
                      role="checkbox"
                      selected={isItemSelected}
                      aria-checked={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          onChange={(event) => handleClick(event, emailAddress)}
                        />
                      </TableCell>
                      <TableCell component="th" scope="row" padding="none">
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar
                            {...stringAvatar(`${name.first} ${name.last}`)}
                            style={{ marginRight: 8 }}
                          />
                          <Typography variant="subtitle2" noWrap>
                            {`${name.first} ${name.last ? name.last : ''}`}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="left">{emailAddress}</TableCell>
                      <TableCell align="center">
                        <Iconify
                          icon={
                            oAuthProvider ? `bi:${oAuthProvider}` : 'fluent:password-16-regular'
                          }
                          sx={{
                            width: 20,
                            height: 20,
                          }}
                          color={
                            (oAuthProvider === 'github' && 'black.main') ||
                            (oAuthProvider === 'facebook' && 'info.main') ||
                            (oAuthProvider === 'google' && 'error.main')
                          }
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Iconify
                          icon={emailVerified ? 'eva:checkmark-circle-fill' : 'eva:clock-outline'}
                          sx={{
                            width: 20,
                            height: 20,
                            color: 'success.main',
                            ...(!emailVerified && { color: 'warning.main' }),
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <TableMoreMenu
                          onDelete={onDelete}
                          _id={_id}
                          editLink={`${PATH_DASHBOARD.users}/${_id}/edit`}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>

            {isUserNotFound && (
              <TableBody>
                <TableRow>
                  <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                    <SearchNotFound searchQuery={filterName} />
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>
        </TableContainer>
      </Scrollbar>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={userList.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Card>
  );
}

UserList.propTypes = {
  userList: PropTypes.array,
  onDelete: PropTypes.func,
};
