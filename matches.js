// matches.js - Advanced Match Management with DBMS Integration
class MatchManager {
    constructor() {
        this.API_BASE = 'http://localhost:3000/api';
        this.matches = [];
        this.filteredMatches = [];
        this.tournaments = [];
        this.teams = [];
        this.filters = {
            tournament: '',
            status: '',
            date: ''
        };
        this.init();
    }

    async init() {
        await this.loadTournaments();
        await this.loadTeams();
        await this.loadMatches();
        this.setupEventListeners();
        this.populateFilters();
    }

    async loadTournaments() {
        try {
            const tournaments = await apiRequest('/tournaments');
            this.tournaments = tournaments;
            this.populateTournamentSelects();
        } catch (error) {
            console.error('Error loading tournaments:', error);
            this.showError('Failed to load tournaments');
        }
    }

    async loadTeams() {
        try {
            const teams = await apiRequest('/teams');
            this.teams = teams;
            this.populateTeamSelects();
        } catch (error) {
            console.error('Error loading teams:', error);
            this.showError('Failed to load teams');
        }
    }

    async loadMatches() {
        this.showLoading(true);
        try {
            const matches = await apiRequest('/matches');
            this.matches = matches;
            this.filteredMatches = [...matches];
            this.renderMatches();
            this.showLoading(false);
        } catch (error) {
            console.error('Error loading matches:', error);
            this.showError('Failed to load matches');
            this.showLoading(false);
        }
    }

    populateTournamentSelects() {
        const tournamentSelect = document.getElementById('tournamentSelect');
        const tournamentFilter = document.getElementById('tournamentFilter');
        
        if (tournamentSelect) {
            tournamentSelect.innerHTML = '<option value="">Select Tournament</option>';
            this.tournaments.forEach(tournament => {
                const option = document.createElement('option');
                option.value = tournament.tournament_id;
                option.textContent = tournament.tournament_name;
                tournamentSelect.appendChild(option);
            });
        }
        
        if (tournamentFilter) {
            tournamentFilter.innerHTML = '<option value="">All Tournaments</option>';
            this.tournaments.forEach(tournament => {
                const option = document.createElement('option');
                option.value = tournament.tournament_id;
                option.textContent = tournament.tournament_name;
                tournamentFilter.appendChild(option);
            });
        }
    }

    populateTeamSelects() {
        const team1Select = document.getElementById('team1Select');
        const team2Select = document.getElementById('team2Select');
        
        if (team1Select && team2Select) {
            team1Select.innerHTML = '<option value="">Select Team 1</option>';
            team2Select.innerHTML = '<option value="">Select Team 2</option>';
            
            this.teams.forEach(team => {
                const option1 = document.createElement('option');
                option1.value = team.team_id;
                option1.textContent = team.team_name;
                team1Select.appendChild(option1.cloneNode(true));
                
                const option2 = option1.cloneNode(true);
                team2Select.appendChild(option2);
            });
        }
    }

    populateFilters() {
        // Filters are populated in populateTournamentSelects
    }

    renderMatches() {
        const container = document.getElementById('matchesContainer');
        const emptyState = document.getElementById('emptyState');
        
        if (!container) return;
        
        if (this.filteredMatches.length === 0) {
            container.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        }
        
        container.style.display = 'grid';
        emptyState.style.display = 'none';
        
        container.innerHTML = '';
        
        this.filteredMatches.forEach(match => {
            const card = this.createMatchCard(match);
            container.appendChild(card);
        });
    }

    createMatchCard(match) {
        const card = document.createElement('div');
        card.className = `match-card ${match.match_status}`;
        
        const matchDate = new Date(match.match_date);
        const now = new Date();
        const isLive = match.match_status === 'ongoing';
        const isCompleted = match.match_status === 'completed';
        
        const team1Abbr = this.getTeamAbbreviation(match.team1_name);
        const team2Abbr = this.getTeamAbbreviation(match.team2_name);
        
        card.innerHTML = `
            <div class="match-header">
                <div class="match-tournament">${match.tournament_name || 'No Tournament'}</div>
                <div class="match-type">${this.formatMatchType(match.match_type)}</div>
            </div>
            
            <div class="match-teams">
                <div class="team">
                    <div class="team-logo ${team1Abbr}"></div>
                    <div class="team-name">${match.team1_name}</div>
                    ${isCompleted ? `<div class="team-score">${match.team1_score || '0'}</div>` : ''}
                </div>
                
                <div class="vs-container">
                    <div class="vs">VS</div>
                    <div class="match-status status-${match.match_status}">
                        ${isLive ? '<span class="live-indicator"><span class="live-dot"></span> LIVE</span>' : match.match_status}
                    </div>
                </div>
                
                <div class="team">
                    <div class="team-logo ${team2Abbr}"></div>
                    <div class="team-name">${match.team2_name}</div>
                    ${isCompleted ? `<div class="team-score">${match.team2_score || '0'}</div>` : ''}
                </div>
            </div>
            
            ${isCompleted && match.winner_name ? `
                <div class="match-result winner">
                    🏆 ${match.winner_name} won the match
                    ${match.man_of_match ? `<br><small>Man of the Match: ${match.man_of_match}</small>` : ''}
                </div>
            ` : ''}
            
            <div class="match-info">
                <div class="match-info-item">
                    <i>📅</i>
                    <span>${this.formatMatchDate(match.match_date)}</span>
                </div>
                <div class="match-info-item">
                    <i>📍</i>
                    <span>${match.venue || 'TBD'}</span>
                </div>
                <div class="match-info-item">
                    <i>⏰</i>
                    <span>${this.formatMatchTime(match.match_date)}</span>
                </div>
                <div class="match-info-item">
                    <i>🏆</i>
                    <span>${match.match_type || 'Group Stage'}</span>
                </div>
            </div>
            
            <div class="match-actions">
                ${isLive ? `
                    <button class="btn btn-primary" onclick="matchManager.updateLiveScore(${match.match_id})">
                        Update Score
                    </button>
                ` : ''}
                
                ${match.match_status === 'scheduled' ? `
                    <button class="btn btn-secondary" onclick="matchManager.startMatch(${match.match_id})">
                        Start Match
                    </button>
                ` : ''}
                
                <button class="btn btn-outline" onclick="matchManager.viewMatchDetails(${match.match_id})">
                    View Details
                </button>
                
                ${!isCompleted ? `
                    <button class="btn btn-outline" onclick="matchManager.cancelMatch(${match.match_id})">
                        Cancel
                    </button>
                ` : ''}
            </div>
        `;
        
        return card;
    }

    filterMatches() {
        const tournamentFilter = document.getElementById('tournamentFilter').value;
        const statusFilter = document.getElementById('statusFilter').value;
        const dateFilter = document.getElementById('dateFilter').value;
        
        this.filters = {
            tournament: tournamentFilter,
            status: statusFilter,
            date: dateFilter
        };
        
        this.filteredMatches = this.matches.filter(match => {
            let passesTournament = true;
            let passesStatus = true;
            let passesDate = true;
            
            if (tournamentFilter) {
                passesTournament = match.tournament_id == tournamentFilter;
            }
            
            if (statusFilter) {
                passesStatus = match.match_status === statusFilter;
            }
            
            if (dateFilter) {
                const matchDate = new Date(match.match_date).toDateString();
                const filterDate = new Date(dateFilter).toDateString();
                passesDate = matchDate === filterDate;
            }
            
            return passesTournament && passesStatus && passesDate;
        });
        
        this.renderMatches();
    }

    clearFilters() {
        document.getElementById('tournamentFilter').value = '';
        document.getElementById('statusFilter').value = '';
        document.getElementById('dateFilter').value = '';
        this.filterMatches();
    }

    setupEventListeners() {
        const matchForm = document.getElementById('matchForm');
        if (matchForm) {
            matchForm.addEventListener('submit', (e) => this.handleMatchFormSubmit(e));
        }
    }

    async handleMatchFormSubmit(e) {
        e.preventDefault();
        
        const formData = {
            tournament_id: document.getElementById('tournamentSelect').value,
            team1_id: document.getElementById('team1Select').value,
            team2_id: document.getElementById('team2Select').value,
            match_date: document.getElementById('matchDateTime').value,
            venue: document.getElementById('venue').value,
            match_type: document.getElementById('matchType').value
        };
        
        try {
            // This would be implemented when you add the match creation API endpoint
            console.log('Match creation data:', formData);
            this.showMessage('Match scheduling feature coming soon!', 'success');
            this.closeCreateMatchModal();
        } catch (error) {
            this.showError('Failed to schedule match: ' + error.message);
        }
    }

    // Utility functions
    getTeamAbbreviation(teamName) {
        if (!teamName) return 'default';
        return teamName.split(' ').map(word => word[0]).join('').toLowerCase();
    }

    formatMatchType(type) {
        const types = {
            'group': 'Group Stage',
            'quarterfinal': 'Quarter Final',
            'semifinal': 'Semi Final',
            'final': 'Final'
        };
        return types[type] || 'Group Stage';
    }

    formatMatchDate(dateString) {
        if (!dateString) return 'TBD';
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }

    formatMatchTime(dateString) {
        if (!dateString) return 'TBD';
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    }

    // Action methods (to be implemented)
    updateLiveScore(matchId) {
        this.showMessage('Live score update feature coming soon!', 'info');
    }

    startMatch(matchId) {
        this.showMessage('Match starting feature coming soon!', 'info');
    }

    viewMatchDetails(matchId) {
        this.showMessage('Match details feature coming soon!', 'info');
    }

    cancelMatch(matchId) {
        if (confirm('Are you sure you want to cancel this match?')) {
            this.showMessage('Match cancellation feature coming soon!', 'info');
        }
    }

    // UI helpers
    showLoading(show) {
        const loadingState = document.getElementById('loadingState');
        const matchesContainer = document.getElementById('matchesContainer');
        const emptyState = document.getElementById('emptyState');
        
        if (show) {
            loadingState.style.display = 'flex';
            matchesContainer.style.display = 'none';
            emptyState.style.display = 'none';
        } else {
            loadingState.style.display = 'none';
        }
    }

    showMessage(message, type = 'info') {
        // You can implement a toast notification system here
        if (type === 'error') {
            console.error('Match Manager Error:', message);
            alert('Error: ' + message);
        } else {
            console.log('Match Manager:', message);
            alert(message);
        }
    }

    showError(message) {
        this.showMessage(message, 'error');
    }
}

// Modal functions
function openCreateMatchModal() {
    document.getElementById('createMatchModal').style.display = 'block';
}

function closeCreateMatchModal() {
    document.getElementById('createMatchModal').style.display = 'none';
    document.getElementById('matchForm').reset();
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    const modal = document.getElementById('createMatchModal');
    if (e.target === modal) {
        closeCreateMatchModal();
    }
});

// Initialize Match Manager
let matchManager;

document.addEventListener('DOMContentLoaded', function() {
    matchManager = new MatchManager();
});