import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import api from '../../services/api';

import Container from '../../Components/Container';
import Pagination from '../../Components/Pagination';
import { Loading, Owner, BtnFilter, IssueList } from './styles';

export default class Repository extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        repository: PropTypes.string,
      }),
    }).isRequired,
  };

  state = {
    repository: {},
    issues: [],
    page: 1,
    filters: [
      { state: 'all', label: 'Todas', active: true },
      { state: 'open', label: 'Abertas', active: false },
      { state: 'closed', label: 'Fechadas', active: false },
    ],
    filterIndex: 0,
    loading: true,
  };

  async componentDidMount() {
    const { match } = this.props;
    const { filters } = this.state;
    const itemsPerPage = 30;

    const repoName = decodeURIComponent(match.params.repository);

    const [repository, issues] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`repos/${repoName}/issues`, {
        params: {
          state: filters.find(f => f.active).state,
          per_page: itemsPerPage,
        },
      }),
    ]);

    this.setState({
      repository: repository.data,
      issues: issues.data,
      loading: false,
    });
  }

  loadIssues = async () => {
    const { match } = this.props;
    const { filters, filterIndex, page } = this.state;
    const itemsPerPage = 30;

    const repoName = decodeURIComponent(match.params.repository);

    const response = await api.get(`repos/${repoName}/issues`, {
      params: {
        state: filters[filterIndex].state,
        page,
        per_page: itemsPerPage,
      },
    });

    this.setState({ issues: response.data });
  };

  handlerFilterClick = async e => {
    const filterIndex = e.target.value;
    const items = this.state.filters.forEach((item, index) => {
      item.active = index == filterIndex;
    });

    const newFilters = [...this.state.filters];

    await this.setState({ filterIndex, filters: newFilters });

    this.loadIssues();
  };

  handlerPage = async e => {
    const { page } = this.state;
    const action = e.target.value;

    this.setState({
      page: action === 'back' ? page - 1 : page + 1,
    });

    this.loadIssues();
  };

  render() {
    const { repository, issues, loading } = this.state;

    if (loading) {
      return <Loading>Carregando...</Loading>;
    }

    return (
      <Container>
        <Owner>
          <Link to="/">Voltar aos respositórios</Link>
          <img src={repository.owner.avatar_url} alt={repository.owner.login} />
          <h1>{repository.name}</h1>
          <p>{repository.description}</p>
        </Owner>
        <BtnFilter>
          {this.state.filters.map((filter, index) => (
            <li key={filter.label}>
              <button
                type="button"
                disabled={filter.active}
                value={index}
                onClick={this.handlerFilterClick}
              >
                {filter.label}
              </button>
            </li>
          ))}
        </BtnFilter>
        <IssueList>
          {issues.map(issue => (
            <li key={String(issue.id)}>
              <img src={issue.user.avatar_url} alt={issue.user.login} />
              <div>
                <strong>
                  <a
                    href={issue.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {issue.title}
                  </a>
                  {issue.labels.map(label => (
                    <span key={String(label.id)}>{label.name}</span>
                  ))}
                </strong>
                <p>{issue.user.login}</p>
              </div>
            </li>
          ))}
        </IssueList>
        <Pagination page={this.state.page} onClick={() => this.handlerPage} />
      </Container>
    );
  }
}
