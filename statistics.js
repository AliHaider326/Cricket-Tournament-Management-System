// statistics.js - Advanced Statistics with DBMS Integration
class StatisticsManager {
    constructor() {
        this.API_BASE = 'http://localhost:3000/api';
        this.stats = {
            overview: {},
            players: {},
            teams: {},
            tournaments: {}
        };
        this.init();
    }

    async init() {
        await this.loadOverviewStats();
        this.setupTabNavigation();
        
        // Load other tabs when activated
        document.getElementById('players').addEventListener('click', () => this.loadPlayerStats());
        document.getElementById('teams').addEventListener('click', () => this.loadTeamStats());
        document.getElementById('tournaments').addEventListener('click', () => this.loadTournamentStats());
    }

    // Tab Navigation
    setupTabNavigation() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabName = btn.textContent.toLowerCase();
                openTab(tabName);
            });
        });
    }

    // Load Overview Statistics
    async loadOverviewStats() {
        try {
            const [dashboardStats, tournaments, teams, matches] = await Promise.all([
                apiRequest('/dashboard/stats'),
                apiRequest('/tournaments'),
                apiRequest('/teams'),
                apiRequest('/matches')
            ]);

            this.stats.overview = {
                dashboard: dashboardStats[0],
                tournaments: tournaments,
                teams: teams,
                matches: matches
            };

            this.updateOverviewStats();
            this.renderCharts();
        } catch (error) {
            console.error('Error loading overview statistics:', error);
            this.showError('Failed to load statistics');
        }
    }

    updateOverviewStats() {
        const { dashboard, tournaments, teams, matches } = this.stats.overview;

        // Update overview cards
        document.getElementById('totalTournaments').textContent = dashboard.total_tournaments || tournaments.length;
        document.getElementById('totalTeams').textContent = dashboard.total_teams || teams.length;
        document.getElementById('totalPlayers').textContent = dashboard.total_players || 0;
        document.getElementById('totalMatches').textContent = dashboard.total_matches || matches.length;
    }

    // Render Charts
    renderCharts() {
        this.renderTournamentChart();
        this.renderMatchChart();
    }

    renderTournamentChart() {
        const tournaments = this.stats.overview.tournaments;
        const statusCount = {
            upcoming: 0,
            ongoing: 0,
            completed: 0
        };

        tournaments.forEach(tournament => {
            statusCount[tournament.status] = (statusCount[tournament.status] || 0) + 1;
        });

        const total = tournaments.length;
        const chartContainer = document.getElementById('tournamentChart');
        
        chartContainer.innerHTML = Object.entries(statusCount).map(([status, count]) => {
            const percentage = total > 0 ? (count / total * 100).toFixed(1) : 0;
            return `
                <div class="chart-bar">
                    <span class="chart-label">${this.capitalizeFirst(status)}</span>
                    <div class="chart-value">
                        <div class="chart-fill ${status}" style="width: ${percentage}%"></div>
                        <span class="chart-percentage">${percentage}%</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderMatchChart() {
        const matches = this.stats.overview.matches;
        const statusCount = {
            scheduled: 0,
            ongoing: 0,
            completed: 0,
            cancelled: 0
        };

        matches.forEach(match => {
            statusCount[match.match_status] = (statusCount[match.match_status] || 0) + 1;
        });

        const total = matches.length;
        const chartContainer = document.getElementById('matchChart');
        
        chartContainer.innerHTML = Object.entries(statusCount).map(([status, count]) => {
            const percentage = total > 0 ? (count / total * 100).toFixed(1) : 0;
            return `
                <div class="chart-bar">
                    <span class="chart-label">${this.capitalizeFirst(status)}</span>
                    <div class="chart-value">
                        <div class="chart-fill ${status}" style="width: ${percentage}%"></div>
                        <span class="chart-percentage">${percentage}%</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Load Player Statistics
    async loadPlayerStats() {
        try {
            const [topBatsmen, topBowlers] = await Promise.all([
                apiRequest('/statistics/top-batsmen'),
                apiRequest('/statistics/top-bowlers')
            ]);

            this.stats.players = { topBatsmen, topBowlers };
            this.renderPlayerStats();
        } catch (error) {
            console.error('Error loading player statistics:', error);
            this.showPlayerStatsError();
        }
    }

    renderPlayerStats() {
        this.renderTopBatsmen();
        this.renderTopBowlers();
    }

    renderTopBatsmen() {
        const table = document.getElementById('topBatsmenTable');
        const batsmen = this.stats.players.topBatsmen;

        if (!batsmen || batsmen.length === 0) {
            table.querySelector('tbody').innerHTML = '<tr><td colspan="6" class="empty-message">No batsmen data available</td></tr>';
            return;
        }

        table.querySelector('tbody').innerHTML = batsmen.map(player => `
            <tr>
                <td><strong>${player.player_name}</strong></td>
                <td>${player.team_name}</td>
                <td>${player.runs_scored || 0}</td>
                <td>${player.batting_average || 0}</td>
                <td>${player.strike_rate || 0}</td>
                <td>${player.centuries || 0}/${player.fifties || 0}</td>
            </tr>
        `).join('');
    }

    renderTopBowlers() {
        const table = document.getElementById('topBowlersTable');
        const bowlers = this.stats.players.topBowlers;

        if (!bowlers || bowlers.length === 0) {
            table.querySelector('tbody').innerHTML = '<tr><td colspan="6" class="empty-message">No bowlers data available</td></tr>';
            return;
        }

        table.querySelector('tbody').innerHTML = bowlers.map(player => `
            <tr>
                <td><strong>${player.player_name}</strong></td>
                <td>${player.team_name}</td>
                <td>${player.wickets_taken || 0}</td>
                <td>${player.bowling_average || 0}</td>
                <td>${player.economy_rate || 0}</td>
                <td>${player.five_wickets || 0}</td>
            </tr>
        `).join('');
    }

    // Load Team Statistics
    async loadTeamStats() {
        try {
            const teams = await apiRequest('/teams');
            const matches = await apiRequest('/matches');
            
            this.stats.teams = { teams, matches };
            this.renderTeamStats();
        } catch (error) {
            console.error('Error loading team statistics:', error);
            this.showTeamStatsError();
        }
    }

    renderTeamStats() {
        const table = document.getElementById('teamStatsTable');
        const { teams, matches } = this.stats.teams;

        if (!teams || teams.length === 0) {
            table.querySelector('tbody').innerHTML = '<tr><td colspan="6" class="empty-message">No team data available</td></tr>';
            return;
        }

        // Calculate team performance
        const teamPerformance = teams.map(team => {
            const teamMatches = matches.filter(match => 
                match.team1_name === team.team_name || match.team2_name === team.team_name
            );
            
            const wonMatches = teamMatches.filter(match => 
                match.winner_name === team.team_name
            ).length;

            const winPercentage = teamMatches.length > 0 ? 
                ((wonMatches / teamMatches.length) * 100).toFixed(1) : 0;

            return {
                name: team.team_name,
                matches: teamMatches.length,
                won: wonMatches,
                lost: teamMatches.length - wonMatches,
                winPercentage: winPercentage,
                nrr: 0 // Net Run Rate calculation would go here
            };
        });

        table.querySelector('tbody').innerHTML = teamPerformance.map(team => `
            <tr>
                <td><strong>${team.name}</strong></td>
                <td>${team.matches}</td>
                <td>${team.won}</td>
                <td>${team.lost}</td>
                <td>
                    <span class="performance-indicator ${
                        team.winPercentage >= 60 ? 'performance-excellent' :
                        team.winPercentage >= 40 ? 'performance-good' :
                        team.winPercentage >= 20 ? 'performance-average' : 'performance-poor'
                    }">
                        ${team.winPercentage}%
                    </span>
                </td>
                <td>${team.nrr}</td>
            </tr>
        `).join('');
    }

    // Load Tournament Statistics
    async loadTournamentStats() {
        try {
            const tournaments = await apiRequest('/tournaments');
            this.stats.tournaments = { tournaments };
            this.renderTournamentStats();
        } catch (error) {
            console.error('Error loading tournament statistics:', error);
            this.showTournamentStatsError();
        }
    }

    renderTournamentStats() {
        const table = document.getElementById('tournamentStatsTable');
        const tournaments = this.stats.tournaments.tournaments;

        if (!tournaments || tournaments.length === 0) {
            table.querySelector('tbody').innerHTML = '<tr><td colspan="5" class="empty-message">No tournament data available</td></tr>';
            return;
        }

        table.querySelector('tbody').innerHTML = tournaments.map(tournament => `
            <tr>
                <td><strong>${tournament.tournament_name}</strong></td>
                <td>${tournament.registered_teams || 0}</td>
                <td>${tournament.total_matches || 0}</td>
                <td>${this.formatDate(tournament.start_date)}</td>
                <td>
                    <span class="performance-indicator ${
                        tournament.status === 'completed' ? 'performance-excellent' :
                        tournament.status === 'ongoing' ? 'performance-good' : 'performance-average'
                    }">
                        ${this.capitalizeFirst(tournament.status)}
                    </span>
                </td>
            </tr>
        `).join('');
    }

    // Utility Functions
    capitalizeFirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    formatDate(dateString) {
        if (!dateString) return 'TBD';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    // Error Handling
    showError(message) {
        console.error('Statistics Error:', message);
    }

    showPlayerStatsError() {
        const batsmenTable = document.getElementById('topBatsmenTable');
        const bowlersTable = document.getElementById('topBowlersTable');
        
        if (batsmenTable) {
            batsmenTable.querySelector('tbody').innerHTML = '<tr><td colspan="6" class="error-message">Failed to load batsmen data</td></tr>';
        }
        if (bowlersTable) {
            bowlersTable.querySelector('tbody').innerHTML = '<tr><td colspan="6" class="error-message">Failed to load bowlers data</td></tr>';
        }
    }

    showTeamStatsError() {
        const table = document.getElementById('teamStatsTable');
        if (table) {
            table.querySelector('tbody').innerHTML = '<tr><td colspan="6" class="error-message">Failed to load team statistics</td></tr>';
        }
    }

    showTournamentStatsError() {
        const table = document.getElementById('tournamentStatsTable');
        if (table) {
            table.querySelector('tbody').innerHTML = '<tr><td colspan="5" class="error-message">Failed to load tournament statistics</td></tr>';
        }
    }
}

// Tab Navigation Function
function openTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => tab.classList.remove('active'));
    
    // Remove active class from all buttons
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => btn.classList.remove('active'));
    
    // Show the selected tab content
    document.getElementById(tabName).classList.add('active');
    
    // Activate the clicked button
    event.currentTarget.classList.add('active');
}

// Add error message style
const style = document.createElement('style');
style.textContent = `
    .error-message {
        color: var(--error-color);
        text-align: center;
        padding: 20px;
        font-style: italic;
    }
`;
document.head.appendChild(style);

// Initialize Statistics Manager
let statisticsManager;

document.addEventListener('DOMContentLoaded', function() {
    statisticsManager = new StatisticsManager();
});